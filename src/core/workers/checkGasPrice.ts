import { Worker } from "bullmq";
import appConstants from "../constants/appConstants";
import providers from "../providers";
import { AlertRule } from "../../db/entities/AlertRule";
import { ethers } from "ethers";
import { AlertRuleStatus } from "../enums/alertRuleStatus";
import { match } from "node:assert";
import {
  checkRecentAlert,
  createAlertHistory,
} from "../utils/alertHistoryUtilities";
import { AlertHistoryStatus } from "../enums/alertHistoryStatus";
import envConstants from "../constants/envConstants";

export const checkGasPrice = new Worker(
  appConstants.QUEUE_NAMES.OUTGOING_ETH_QUEUE,
  async (job) => {
    try {
      console.log("~Checking the gas price at a specific threshold value~");
      const { alerts } = job.data;

      const gasPriceInWei = (await providers.ethereumWs.getFeeData()).gasPrice;

      if (!gasPriceInWei || gasPriceInWei <= 0n) {
        return { processed: 0 };
      }

      const gasPriceInGwei = parseFloat(
        ethers.formatUnits(gasPriceInWei, "gwei"),
      );

      let processedCount = 0;

      for (let alert of alerts) {
        try {
          const thresholdValue = BigInt(alert.thresholdValue);
          let matches = false;

          switch (alert.alertRuleStatus) {
            case AlertRuleStatus.GREATER_THAN:
              matches = gasPriceInWei > thresholdValue;
              break;
            case AlertRuleStatus.LESS_THAN:
              matches = gasPriceInWei < thresholdValue;
              break;
            case AlertRuleStatus.EQUALS:
              matches = gasPriceInWei === thresholdValue;
              break;
          }

          if (matches) {
            // Check if we already alerted recently (prevent spam)
            const hasRecentAlert = await checkRecentAlert(alert.id);

            if (hasRecentAlert) {
              console.log(`Already alerted recently, skipping`);
              continue;
            }

            // Create alert history
            const eventData = {
              gasPriceInWei: gasPriceInWei.toString(),
              gasPriceInGwei: gasPriceInGwei.toFixed(2),
              thresholdInWei: thresholdValue.toString(),
              thresholdInGwei: ethers.formatUnits(thresholdValue, "gwei"),
              condition: alert.alertRuleStatus,
            };

            await createAlertHistory(alert, eventData, AlertHistoryStatus.SENT);
            console.log(`Alert saved`);
            processedCount++;

            // TODO: Send email/webhook
            // await sendEmailAlert(alert.user.email, {
            //   message: `Gas price is ${alert.alertRuleStatus} ${gasPriceInGwei} gwei`,
            //   ...eventData
            // });
          }
        } catch (error) {
          console.warn("Error occurred at ");
          continue;
        }
      }

      return { processed: processedCount };
    } catch (error) {
      throw new Error("An error occurred here");
    }
  },
  {
    connection: {
      host: envConstants.REDIS_OPTIONS.host,
      port: envConstants.REDIS_OPTIONS.port,
    },
  },
);


checkGasPrice.on('ready', () => {
  console.log('PROCESS CHECK GAS PRICE WORKER IS READY AND LISTENING FOR JOBS ');
 });

checkGasPrice.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

checkGasPrice.on("failed", (job:any, error:any) => {
  console.error(`Job ${job.id} failed:`, error.message);
});

checkGasPrice.on("error", (error) => {
  console.error("Worker error:", error);
});