import { ethers } from "ethers";
import providers from "../../providers";
import { AlertRule } from "../../../db/entities/AlertRule";
import appConstants from "../../constants/appConstants";
import { processWalletBalanceAlert } from "./WalletBalanceHandler";
import { processIncomingEthAlert } from "./IncomingEthHandler";
import { processOutgoingEthAlert } from "./outgoingEthHandler";
export class EthereumListenerService {
  private provider: ethers.WebSocketProvider;

  constructor() {
    this.provider = providers.ethereumWs;
  }

  async startListening() {
    console.log("Listening for transactions");

    this.provider.on("block", async (blockNumber) => {
      try {
        const alerts = await AlertRule.find({
          where: {
            isActive: true,
          },
          relations: {
            user: true,
            alertType: true,
          },
        });
        const incomingEthAlerts = alerts.filter(
          (alert) =>
            alert.alertType.type ===
            appConstants.alertTypeNames.INCOMING_ETH
        );

        const walletBalanceAlerts = alerts.filter(
          (alert) =>
            alert.alertType.type ===
            appConstants.alertTypeNames.WALLET_BALANCE
        );
        const outgoingEthAlerts = alerts.filter((alert)=> alert.alertType.type === appConstants.alertTypeNames.OUTGOING_ETH)

        await processIncomingEthAlert(incomingEthAlerts, blockNumber);

        await processWalletBalanceAlert(walletBalanceAlerts);
        await processOutgoingEthAlert(blockNumber, outgoingEthAlerts);

      } catch (error) {
        console.error(error);
      }
    });
  }
}