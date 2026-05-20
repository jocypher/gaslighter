import { ethers } from "ethers";
import providers from "../../providers";
import { AlertRule } from "../../../db/entities/AlertRule";
import { AlertType } from "../../../db/entities/AlertType";
import { AlertTypeNames } from "../../constants/alertTypeNames";
import { AlertRuleStatus } from "../../enums/alertRuleStatus";
import { match } from "node:assert";
import { AlertHistory } from "../../../db/entities/AlertHistory";
import { AlertHistoryStatus } from "../../enums/alertHistoryStatus";

export class EthereumListenerService {
  private provider: ethers.WebSocketProvider;

  constructor() {
    this.provider = providers.ethereumWs;
  }

  async startListening() {
    console.log("Listening for transaction");

    this.provider.on("block", async (blockNumber) => {

      const rules = await AlertRule.find({
        where: {
          isActive: true,
          alertType: { type: AlertTypeNames.INCOMING_ETH },
        },
        relations: {
          user: true,
          alertType: true,
        },
      });

      for (const rule of rules) {
        console.log(rule)
        if (rule.alertType.type === AlertTypeNames.WALLET_BALANCE) {
          await this.checkBalanceRule(rule);
        } else if (rule.alertType.type === AlertTypeNames.INCOMING_ETH) {
          await this.watchIncomingEthRule(rule, blockNumber);
        }
      }
    });
  }

  private async checkBalanceRule(rule: AlertRule) {
    try {
      const balanceInWei = await this.provider.getBalance(rule.targetAddress);

      let matches = false;

      switch (rule.alertRuleStatus) {
        case AlertRuleStatus.GREATER_THAN:
          matches = balanceInWei > rule.thresholdValue;
          break;

        case AlertRuleStatus.LESS_THAN:
          matches = balanceInWei < rule.thresholdValue;
          break;
        case AlertRuleStatus.EQUALS:
          matches = balanceInWei === rule.thresholdValue;
          break;
      }

      if (matches) {
        // send email
        console.log(`Alert triggered for rule ${rule.id}`);
     

        const alertHistory = new AlertHistory();
        alertHistory.alertRule = rule; 
        alertHistory.triggeredAt = new Date();
        alertHistory.eventData = { balance: ethers.formatEther(balanceInWei) };
        alertHistory.status = AlertHistoryStatus.SENT;
        await alertHistory.save();
      }
    } catch (error) {
      console.error(`Error checking rule ${rule.id}:`, error);
    }
  }

  private async watchIncomingEthRule(rule: AlertRule, blockNumber: any) {
    try {
      const block = await this.provider.getBlock(blockNumber, true);
      console.log(block);
      if (!block || !block.transactions) return;

      for (const tx of block?.transactions) {
        const fullTx = await this.provider.getTransaction(tx as string);
        if (!fullTx) return;

        console.log("Incoming Eth Balance");
        const data = {
          from: fullTx.from,
          to: fullTx.to,
          amount: ethers.formatEther(fullTx.value),
          txHash: fullTx.hash,
          block: blockNumber,
        };
        console.log(data);
        if (fullTx.to === rule.targetAddress) {
          const alertHistory = new AlertHistory();
          alertHistory.alertRule = rule;
          alertHistory.triggeredAt = new Date();
          alertHistory.eventData = data
          alertHistory.status = AlertHistoryStatus.SENT;
          await alertHistory.save();
        }
      }
    } catch (error) {
      console.error(`Error checking rule ${rule.id}:`, error);
    }
  }
}
