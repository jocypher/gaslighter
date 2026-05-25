import { ethers } from "ethers";
import providers from "../../providers";
import { AlertRule } from "../../../db/entities/AlertRule";
import appConstants from "../../constants/appConstants";
import { processWalletBalanceAlert } from "./WalletBalanceHandler";
import { processIncomingEthAlert } from "./IncomingEthHandler";
import { processOutgoingEthAlert } from "./outgoingEthHandler";
import redisService from "../redis/redisService";
export class EthereumListenerService {
  private provider: ethers.WebSocketProvider;

  constructor() {
    this.provider = providers.ethereumWs;
  }

  async startListening() {
    console.log("Listening for transactions");

    this.provider.on("block", async (blockNumber) => {
      try {
        const alerts = await getCachedAlertRules()
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

        await processIncomingEthAlert(incomingEthAlerts, blockNumber);

        await processWalletBalanceAlert(walletBalanceAlerts);
        await processOutgoingEthAlert(blockNumber, outgoingEthAlerts);
      } catch (error) {
        console.error(error);
      }
    });
  }
}

async function getCachedAlertRules():Promise<AlertRule[]>{
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
      },
    });

    await redisService.setAlerts(alerts);
    return alerts;
  } catch (error) {
    console.warn(`Error occurred on the system`);
    throw new Error("Error occurred")
  }
}