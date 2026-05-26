import { ethers } from "ethers";
import { AlertHistory } from "../../db/entities/AlertHistory";
import { AlertRule } from "../../db/entities/AlertRule";
import { AlertRuleStatus } from "../enums/alertRuleStatus";
import { AlertHistoryStatus } from "../enums/alertHistoryStatus";
import providers from "../providers";
import { MoreThan } from "typeorm";
import { Worker } from "bullmq";
import envConstants from "../constants/envConstants";
import appConstants from "../constants/appConstants";
import { checkRecentAlert, createAlertHistory } from "../utils/alertHistoryUtilities";

// export async function processWalletBalanceAlert(alerts: AlertRule[]) {
//   try {
//     const addressMap = new Map<string, AlertRule[]>();
//     for (const alert of alerts) {
//       const address = alert.targetAddress.toLowerCase();
//       if (!addressMap.has(address)) {
//         addressMap.set(address, []);
//       }
//       addressMap.get(address)?.push(alert);
//     }

//     for (const [address, addressRules] of addressMap) {
//       const balanceInWei = await providers.ethereumWs.getBalance(address);

//       for (const rule of addressRules) {
//         let matches = false;
//         const threshold = BigInt(rule.thresholdValue);

//         switch (rule.alertRuleStatus) {
//           case AlertRuleStatus.GREATER_THAN:
//             matches = balanceInWei > threshold;
//             break;
//           case AlertRuleStatus.LESS_THAN:
//             matches = balanceInWei < threshold;
//             break;
//           case AlertRuleStatus.EQUALS:
//             matches = balanceInWei === threshold;
//             break;
//         }

//         if (matches) {
//           const recentAlert = await AlertHistory.findOne({
//             where: {
//               alertRule: { id: rule.id },
//               triggeredAt: MoreThan(new Date(Date.now() - 60 * 60 * 1000)),
//             },
//             order: { triggeredAt: "DESC" },
//           });

//           if (recentAlert) {
//             console.warn(
//               `Already alerted for rule ${rule.id} recently. Skipping.`,
//             );
//             continue;
//           }

//           console.log(`Sending balance alert to user ${rule.user.id}`);

//           const alertHistory = new AlertHistory();
//           alertHistory.alertRule = rule;
//           alertHistory.triggeredAt = new Date();
//           alertHistory.eventData = {
//             address,
//             balance: ethers.formatEther(balanceInWei),
//           };
//           alertHistory.status = AlertHistoryStatus.SENT;
//           await alertHistory.save();
//         }
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

export const processWalletBalanceWorker = new Worker(
  appConstants.QUEUE_NAMES.WALLET_BALANCE_QUEUE,
  async (job) => {
    try {
      const { alerts, blockNumber } = job.data;
      const block = await providers.ethereumWs.getBlock(blockNumber, true);

      if (!block || !block.transactions) {
        console.log("No transactions");
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
      let processedCount = 0
      for (const [address, alerts] of addressMap) {
        const balanceInWei = await providers.ethereumWs.getBalance(address);

        for (const alert of alerts) {
          let matches = false;
          const threshold = BigInt(alert.thresholdValue);

          switch (alert.alertRuleStatus) {
            case AlertRuleStatus.GREATER_THAN:
              matches = balanceInWei > threshold;
              break;
            case AlertRuleStatus.LESS_THAN:
              matches = balanceInWei < threshold;
              break;
            case AlertRuleStatus.EQUALS:
              matches = balanceInWei === threshold;
              break;
          }

          if (matches) {
            const recentAlert = await checkRecentAlert(alert.id)
            if (recentAlert) {
              console.warn(
                `Already alerted for rule ${alert.id} recently. Skipping.`,
              );
              continue;
            }

            console.log(`Sending balance alert to user ${alert.user.id}`);

            const eventData = {
              address,
              balance: ethers.formatEther(balanceInWei),
            };

            await createAlertHistory(alert, eventData, AlertHistoryStatus.SENT);
            processedCount++;
          }
        }
      }

      return {processed:processedCount}
      
    } catch (error) {
      console.error(
        "Error occurred when trying to process incoming eth worker",
      );
      throw error;
    }
  },
  {
    connection: {
      host: envConstants.redisOptions.host,
      port: envConstants.redisOptions.port,
    },
  },
);
