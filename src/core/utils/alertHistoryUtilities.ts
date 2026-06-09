import { MoreThan } from 'typeorm';
import { AlertHistory } from '../../db/entities/AlertHistory';
import { AlertHistoryStatus } from '../enums/alertHistoryStatus';
import { AlertRule } from '../../db/entities/AlertRule';

export async function checkRecentAlert(ruleId: number): Promise<boolean> {
  const recentAlert = await AlertHistory.findOne({
    where: {
      alertRule: { id: ruleId },
      triggeredAt: MoreThan(new Date(Date.now() - 60 * 60 * 1000)), // 1 hour
    },
    order: { triggeredAt: 'DESC' },
  });

  return !!recentAlert;
}

export async function createAlertHistory(
  alert: AlertRule,
  eventData: any,
  status: AlertHistoryStatus = AlertHistoryStatus.SENT,
) {
  const alertHistory = new AlertHistory();
  alertHistory.alertRule = alert;
  alertHistory.triggeredAt = new Date();
  alertHistory.eventData = eventData;
  alertHistory.status = status;

  await alertHistory.save();
  return alertHistory;
}
