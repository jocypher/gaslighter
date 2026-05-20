import { ethers } from "ethers";
import { AlertHistory } from "../../../db/entities/AlertHistory";
import { AlertRule } from "../../../db/entities/AlertRule";
import { AlertRuleStatus } from "../../enums/alertRuleStatus";
import { AlertHistoryStatus } from "../../enums/alertHistoryStatus";
import providers from "../../providers";

export default async function processWalletBalanceRules(
  rules: AlertRule[]
) {
  try {
    
    const addressMap = new Map<string, AlertRule[]>();

    for (const rule of rules) {
      const address =
        rule.targetAddress.toLowerCase();

      if (!addressMap.has(address)) {
        addressMap.set(address, []);
      }

      addressMap.get(address)?.push(rule);
    }

    for (const [
      address,
      addressRules,
    ] of addressMap) {
      const balanceInWei =
        await providers.ethereumWs.getBalance(
          address
        );

      for (const rule of addressRules) {
        let matches = false;

        const threshold = BigInt(
          rule.thresholdValue
        );

        switch (rule.alertRuleStatus) {
          case AlertRuleStatus.GREATER_THAN:
            matches =
              balanceInWei > threshold;
            break;

          case AlertRuleStatus.LESS_THAN:
            matches =
              balanceInWei < threshold;
            break;

          case AlertRuleStatus.EQUALS:
            matches =
              balanceInWei === threshold;
            break;
        }

        if (matches) {
          console.log(
            `Sending balance alert to user ${rule.user.id}`
          );

          const alertHistory =
            new AlertHistory();

          alertHistory.alertRule = rule;

          alertHistory.triggeredAt =
            new Date();

          alertHistory.eventData = {
            address,
            balance:
              ethers.formatEther(
                balanceInWei
              ),
          };

          alertHistory.status =
            AlertHistoryStatus.SENT;

          await alertHistory.save();
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}