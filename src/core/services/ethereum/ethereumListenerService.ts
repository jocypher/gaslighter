import { ethers } from "ethers";
import providers from "../../providers";
import { AlertRule } from "../../../db/entities/AlertRule";
import appConstants from "../../constants/appConstants";

import redisService from "../redis/redisService";
import queues from "../bull/bullMQ";
export class EthereumListenerService {
  private provider: ethers.WebSocketProvider;

  constructor() {
    this.provider = providers.ethereumWs;
  }

  async startListening() {
    console.log("Listening for transactions");

    this.provider.on("block", async (blockNumber) => {
      try {
        const alerts = await getCachedAlertRules();
        console.log(alerts);
        const incomingEthAlerts = alerts.filter(
          (alert) =>
            alert.alertType.type === appConstants.alertTypeNames.INCOMING_ETH,
        );

        const walletBalanceAlerts = alerts.filter(
          (alert) =>
            alert.alertType.type === appConstants.alertTypeNames.WALLET_BALANCE,
        );
        const outgoingEthAlerts = alerts.filter(
          (alert) =>
            alert.alertType.type === appConstants.alertTypeNames.OUTGOING_ETH,
        );
        const gasPriceAlerts = alerts.filter(
          (alert) =>
            alert.alertType.type === appConstants.alertTypeNames.GAS_PRICE,
        );

        if (incomingEthAlerts.length > 0) {
          await queues.incomingEthQueue.add(
            appConstants.WORKER_NAMES.INCOMING_ETH_WORKER,
            {
              alerts: incomingEthAlerts,
              blockNumber,
            },
            {
              jobId: `incoming-${blockNumber}`,
              removeOnFail: true,
              attempts: 4,
            },
          );
        }

        if (outgoingEthAlerts.length > 0) {
          await queues.outgoingEthQueue.add(
            appConstants.WORKER_NAMES.OUTGOING_ETH_WORKER,
            {
              alerts: outgoingEthAlerts,
              blockNumber,
            },
            {
              jobId: `outgoing-${blockNumber}`,
              attempts: 4,
              removeOnFail: true,
            },
          );
        }
        if (walletBalanceAlerts.length > 0) {
          await queues.walletBalanceQueue.add(
            appConstants.WORKER_NAMES.WALLET_BALANCE_ETH_WORKER,
            {
              alerts: walletBalanceAlerts,
              blockNumber,
            },
            {
              jobId: `wallet-${blockNumber}`,
              removeOnFail: true,
              attempts: 5,
            },
          );
        }
        if (gasPriceAlerts.length > 0) {
          await queues.gasPriceQueue.add(
            appConstants.WORKER_NAMES.GAS_PRICE_WORKER,
            {
              alerts: gasPriceAlerts,
            },
            {
              jobId: `gasPrice-${blockNumber}`,
              removeOnFail: true,
              attempts: 4,
            },
          );
        }

        // await processWalletBalanceAlert(walletBalanceAlerts);
      } catch (error) {
        console.error(error);
      }
    });
  }
}

async function getCachedAlertRules(): Promise<AlertRule[]> {
  try {
    const cachedAlerts = await redisService.getAlerts();

    if (cachedAlerts) {
      return JSON.parse(cachedAlerts);
    }
    const alerts = await AlertRule.find({
      where: {
        isActive: true,
      },
      relations: {
        user: true,
        alertHistories: true,
        alertType: true,
      },
    });

    await redisService.setAlerts(alerts);
    return alerts;
  } catch (error) {
    console.warn(`Error occurred on the system`);
    throw new Error("Error occurred");
  }
}
