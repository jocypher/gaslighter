import { AlertRule } from '../../db/entities/AlertRule';
import { NotificationType } from '../enums/notificationType';

export class AlertRuleResponseDto {
  id: number;
  targetAddress: string;
  status: string;
  thresholdValue: string;
  notificationType: NotificationType;
  isActive: boolean;
  createdBy: string;

  static from(alertRule: AlertRule): AlertRuleResponseDto {
    return {
      id: alertRule.id,
      targetAddress: alertRule.targetAddress,
      status: alertRule.alertRuleStatus,
      thresholdValue: String(alertRule.thresholdValue),
      notificationType: alertRule.notificationType,
      isActive: alertRule.isActive,
      createdBy: alertRule.user.username,
    };
  }
}
