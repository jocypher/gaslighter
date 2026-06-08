import { ethers } from "ethers";
import { AlertHistory } from "../../db/entities/AlertHistory";
import { AlertRule } from "../../db/entities/AlertRule";
import providers from "../providers";
import { AlertHistoryStatus } from "../enums/alertHistoryStatus";
import { MoreThan } from "typeorm";
import appConstants from "../constants/appConstants";
import { Worker } from "bullmq";
import envConstants from "../constants/envConstants";
import { match } from "node:assert";
import {
  checkRecentAlert,
  createAlertHistory,
} from "../utils/alertHistoryUtilities";
// export async function processOutgoingEthAlert(
//   blockNumber: number,
//   alerts: AlertRule[],
// ) {
//   try {
//     const block = await providers.ethereumWs.getBlock(blockNumber, true);

//     const addressMap = new Map<string, AlertRule[]>();

//     for (const alert of alerts) {
//       const address = alert.targetAddress.toLowerCase();
//       if (!addressMap.has(address)) {
//         addressMap.set(address, []);
//       }
//       addressMap.get(address)?.push(alert);
//     }

//     if (!block || !block.transactions) {
//       throw new Error("Error processing: no block available");
//     }

//     for (const tx of block.transactions) {
//       const fullTx = await providers.ethereumWs.getTransaction(tx);

//       if (!fullTx?.from) {
//         throw new Error("No address found");
//       }
//       const targetAddress = fullTx.from.toLowerCase();

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
//         console.log(`Sending Outgoing ETH alert to user ${alert.user.id}`);

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
//     console.log(error);
//   }
// }

export const processOutgoingEthWorker = new Worker(
  appConstants.QUEUE_NAMES.OUTGOING_ETH_QUEUE,
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
          const fullTx = await providers.ethereumWs.getTransaction(txHash);

          if (!fullTx?.from) {
            continue;
          }
          const targetAddress = fullTx.from.toLowerCase();

          const matchedAlerts = addressMap.get(targetAddress);
          if (!matchedAlerts) continue;
          for (const alert of matchedAlerts) {
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
    connection: {
      host: envConstants.REDIS_OPTIONS.host,
      port: envConstants.REDIS_OPTIONS.port,
    },
  },
);

 processOutgoingEthWorker.on('ready', () => {
  console.log('PROCESS OUTGOING ETH WORKER IS READY AND LISTENING FOR JOBS ');
 });
processOutgoingEthWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

processOutgoingEthWorker.on("failed", (job: any, error: any) => {
  console.error(`Job ${job.id} failed:`, error.message);
});

processOutgoingEthWorker.on("error", (error) => {
  console.error("Worker error:", error);
});



