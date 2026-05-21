import { ethers } from "ethers";
import { AlertRule } from "../../../db/entities/AlertRule";
import providers from "../../providers";
import { AlertHistory } from "../../../db/entities/AlertHistory";
import { AlertHistoryStatus } from "../../enums/alertHistoryStatus";
import { MoreThan } from "typeorm";

export async function processIncomingEthAlert(
  alerts: AlertRule[],
  blockNumber: number,
) {
  try {
    const block = await providers.ethereumWs.getBlock(blockNumber, true);

    if (!block?.transactions) return;

    const addressMap = new Map<string, AlertRule[]>();

    for (const alert of alerts) {
      const address = alert.targetAddress.toLowerCase();

      if (!addressMap.has(address)) {
        addressMap.set(address, []);
      }

      addressMap.get(address)?.push(alert);
    }

    for (const txHash of block.transactions) {
      const fullTx = await providers.ethereumWs.getTransaction(
        txHash as string,
      );

      if (!fullTx?.to) continue;

      const targetAddress = fullTx.to.toLowerCase();

      const matchedAlerts = addressMap.get(targetAddress);

      if (!matchedAlerts) continue;

      for (const alert of matchedAlerts) {
        const recentAlert = await AlertHistory.findOne({
          where: {
            alertRule: { id: alert.id },
            triggeredAt: MoreThan(new Date(Date.now() - 60 * 60 * 1000)),
          },
          order: { triggeredAt: "DESC" },
        });

        if (recentAlert) {
          console.warn(
            `Already alerted for rule ${alert.id} recently. Skipping.`,
          );
          continue;
        }
        console.log(`Sending incoming ETH alert to user ${alert.user.id}`);

        const alertHistory = new AlertHistory();
        const data = {
          from: fullTx.from,
          to: fullTx.to,
          amount: ethers.formatEther(fullTx.value),
          txHash: fullTx.hash,
          block: blockNumber,
        };

        alertHistory.alertRule = alert;
        alertHistory.triggeredAt = new Date();
        alertHistory.eventData = data;
        alertHistory.status = AlertHistoryStatus.SENT;

        await alertHistory.save();
      }
    }
  } catch (error) {
    console.error(error);
  }
}
