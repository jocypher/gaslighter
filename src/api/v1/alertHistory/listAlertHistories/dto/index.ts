import { AlertHistoryStatus } from "../../../../../core/enums/alertHistoryStatus";
import { AlertHistory } from "../../../../../db/entities/AlertHistory";

export class AlertHistoryResponseDto {
  id: number;
  alertRule: Record<string, any>;
  triggeredAt: Date;
  eventData: Record<string, any>;
  status: AlertHistoryStatus;
  deliveredAt: Date;

  static from(alertHistory: AlertHistory): AlertHistoryResponseDto {
    return {
      id: alertHistory.id,
      alertRule: {
        id: alertHistory.alertRule.id,
        alertType: alertHistory.alertRule.alertType,
      },
      triggeredAt: alertHistory.triggeredAt,
      eventData: alertHistory.eventData,
      status: alertHistory.status,
      deliveredAt: alertHistory.deliveredAt,
    };
  }
}
