import { AlertRule } from "../../db/entities/AlertRule"
import { NotificationType } from "../enums/notificationType"

export class AlertRuleResponseDto{
    id: number
    targetAddress: string
    status: string
    thresholdValue: bigint
    notificationType: NotificationType
    isActive: boolean

    static from(alertRule: AlertRule):AlertRuleResponseDto{
        return {
            id: alertRule.id,
            targetAddress: alertRule.targetAddress,
            status: alertRule.alertRuleStatus,
            thresholdValue: alertRule.thresholdValue,
            notificationType: alertRule.notificationType,
            isActive: alertRule.isActive
        }
    }
}