import { AlertRuleStatus } from "../../../../../core/enums/alertRuleStatus";
import { NotificationType } from "../../../../../core/enums/notificationType";
import { AlertType } from "../../../../../db/entities/AlertType";

export default interface UpdateAlertRequest {
  targetAddress:string
  thresholdValue: bigint
  alertStatus: AlertRuleStatus
  notificationType:NotificationType
  webhookUrl:string,
  alertTypeName:string
} 