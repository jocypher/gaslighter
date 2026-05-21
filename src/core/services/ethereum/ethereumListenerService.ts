import { ethers } from "ethers";
import providers from "../../providers";
import { AlertRule } from "../../../db/entities/AlertRule";
import processWalletBalanceRules from "./WalletBalanceHandler";
import processIncomingEthRules from "./IncomingEthHandler";
import appConstants from "../../constants/appConstants";
export class EthereumListenerService {
  private provider: ethers.WebSocketProvider;

  constructor() {
    this.provider = providers.ethereumWs;
  }

  async startListening() {
    console.log("Listening for transactions");

    this.provider.on("block", async (blockNumber) => {
      try {
        const rules = await AlertRule.find({
          where: {
            isActive: true,
          },
          relations: {
            user: true,
            alertType: true,
          },
        });
        const incomingEthRules = rules.filter(
          (rule) =>
            rule.alertType.type ===
            appConstants.alertTypeNames.INCOMING_ETH
        );

        const walletBalanceRules = rules.filter(
          (rule) =>
            rule.alertType.type ===
            appConstants.alertTypeNames.WALLET_BALANCE
        );
        await processIncomingEthRules(
          incomingEthRules,
          blockNumber
        );

        await processWalletBalanceRules(
          walletBalanceRules
        );
      } catch (error) {
        console.error(error);
      }
    });
  }
}