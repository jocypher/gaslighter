import { ethers } from "ethers";
import { AlertRule } from "../../../db/entities/AlertRule";
import providers from "../../providers";
import { AlertHistory } from "../../../db/entities/AlertHistory";
import { AlertHistoryStatus } from "../../enums/alertHistoryStatus";
import { MoreThan } from "typeorm";
import ethQueue from "../bull/bullMQ";
import appConstants from "../../constants/appConstants";
import { checkRecentAlert, createAlertHistory } from "../../utils/alertHistory";
import {Worker} from "bullmq"
import envConstants from "../../constants/envConstants";
// export async function processIncomingEthAlert(
//   alerts: AlertRule[],
//   blockNumber: number,
// ) {
//   try {
//     const block = await providers.ethereumWs.getBlock(blockNumber, true);

//     if (!block?.transactions) return;

//     const addressMap = new Map<string, AlertRule[]>();

//     for (const alert of alerts) {
//       const address = alert.targetAddress.toLowerCase();

//       if (!addressMap.has(address)) {
//         addressMap.set(address, []);
//       }

//       addressMap.get(address)?.push(alert);
//     }

//     for (const txHash of block.transactions) {
//       const fullTx = await providers.ethereumWs.getTransaction(
//         txHash as string,
//       );

//       if (!fullTx?.to) continue;

//       const targetAddress = fullTx.to.toLowerCase();

//       const matchedAlerts = addressMap.get(targetAddress);

//       if (!matchedAlerts) continue;

//       for (const alert of matchedAlerts) {
//         const recentAlert = await AlertHistory.findOne({
//           where: {
//             alertRule: { id: alert.id },
//             triggeredAt: MoreThan(new Date(Date.now() - 60 * 60 * 1000)),
//           },
//           order: { triggeredAt: "DESC" },
//         });

//         if (recentAlert) {
//           console.warn(
//             `Already alerted for rule ${alert.id} recently. Skipping.`,
//           );
//           continue;
//         }
//         console.log(`Sending incoming ETH alert to user ${alert.user.id}`);

//         const alertHistory = new AlertHistory();
//         const data = {
//           from: fullTx.from,
//           to: fullTx.to,
//           amount: ethers.formatEther(fullTx.value),
//           txHash: fullTx.hash,
//           block: blockNumber,
//         };

//         alertHistory.alertRule = alert;
//         alertHistory.triggeredAt = new Date();
//         alertHistory.eventData = data;
//         alertHistory.status = AlertHistoryStatus.SENT;

//         await alertHistory.save();
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

export const processIncomingEthWorker = new Worker(
  appConstants.QUEUE_NAMES.INCOMING_ETH_QUEUE,
  async (job) => {
    try {
      const { alerts, blockNumber } = job.data;

      const block = await providers.ethereumWs.getBlock(blockNumber, true);
      if (!block || !block.transactions) {
        console.log("No transactions in the block");
        return { processed: 0 };
      }
      const addressMap = new Map<string, AlertRule[]>();

      for (const alert of alerts) {
        const address = alert.targetAddress.toLowerCase();

        if (!addressMap.has(address)) {
          addressMap.set(address, []);
        }

        addressMap.get(address)?.push(alert);
      }

      let processedCount = 0;

      for (const txHash of block.transactions) {
        try {
          const fullTx = await providers.ethereumWs.getTransaction(
            txHash as string,
          );
          if (!fullTx?.to) continue;

          const targetAddress = fullTx.to.toLowerCase();
          const matchedAlerts = addressMap.get(targetAddress);
          if (!matchedAlerts) continue;

          // Process matched alerts
          for (const alert of matchedAlerts) {
            // Check alerted recently
            const hasRecentAlert = await checkRecentAlert(alert.id);
            if (hasRecentAlert) {
              console.log(`Already alerted for rule ${alert.id} recently`);
              continue;
            }

            const eventData = {
              from: fullTx.from,
              to: fullTx.to,
              amount: ethers.formatEther(fullTx.value),
              txHash: fullTx.hash,
              blockNumber,
            };

            await createAlertHistory(alert, eventData, AlertHistoryStatus.SENT);
            processedCount++;

            // TODO: Send email/webhook here
            // await sendEmailAlert(alert.user.email, eventData);
          }
        } catch (error) {
          console.warn(`Error processing transaction ${txHash}:`, error);
          continue;
        }
      }
      console.log(
        `Incoming ETH job completed: ${processedCount} alerts processed`,
      );
      return { processed: processedCount };
    } catch (error) {
      console.error(
        "Error occurred when trying to process incoming eth worker",
      );
      throw error;
    }
  },
  {
    connection: envConstants.redisOptions,
    limiter: envConstants.queueOptions.limiter,
  },
);




// Event listeners
processIncomingEthWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

processIncomingEthWorker.on("failed", (job:any, error:any) => {
  console.error(`Job ${job.id} failed:`, error.message);
});

processIncomingEthWorker.on("error", (error) => {
  console.error("Worker error:", error);
});