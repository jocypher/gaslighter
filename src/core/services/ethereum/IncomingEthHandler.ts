import { ethers } from "ethers";
import { AlertRule } from "../../../db/entities/AlertRule";
import providers from "../../providers";
import { AlertHistory } from "../../../db/entities/AlertHistory";
import { AlertHistoryStatus } from "../../enums/alertHistoryStatus";

export default async function processIncomingEthRules(
  rules: AlertRule[],
  blockNumber: number
) {
  try {
    const block = await providers.ethereumWs.getBlock(
      blockNumber,
      true
    );

    if (!block?.transactions) return;

    const addressMap = new Map<string, AlertRule[]>();

    for (const rule of rules) {
      const address =
        rule.targetAddress.toLowerCase();

      if (!addressMap.has(address)) {
        addressMap.set(address, []);
      }

      addressMap.get(address)?.push(rule);
    }

    for (const txHash of block.transactions) {
      const fullTx =
        await providers.ethereumWs.getTransaction(
          txHash as string
        );

      if (!fullTx?.to) continue;

      const targetAddress =
        fullTx.to.toLowerCase();

     
      const matchedRules =
        addressMap.get(targetAddress);

      if (!matchedRules) continue;

      const data = {
        from: fullTx.from,
        to: fullTx.to,
        amount: ethers.formatEther(
          fullTx.value
        ),
        txHash: fullTx.hash,
        block: blockNumber,
      };

      // notify all users monitoring this wallet
      for (const rule of matchedRules) {
        console.log(
          `Sending incoming ETH alert to user ${rule.user.id}`
        );

        const alertHistory = new AlertHistory();

        alertHistory.alertRule = rule;
        alertHistory.triggeredAt = new Date();
        alertHistory.eventData = data;
        alertHistory.status =
          AlertHistoryStatus.SENT;

        await alertHistory.save();
      }
    }
  } catch (error) {
    console.error(error);
  }
}