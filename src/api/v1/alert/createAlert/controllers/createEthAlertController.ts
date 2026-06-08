import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../core/middlewares/authMiddlewares";
import { AlertRuleValidations } from "../../../../../core/utils/alertRuleValidation";
import { AlertRule } from "../../../../../db/entities/AlertRule";
import { NotificationType } from "../../../../../core/enums/notificationType";
import appConstants from "../../../../../core/constants/appConstants";
import { AlertRuleResponseDto } from "../../../../../core/utils/sharedDto";

async function CreateEthAlertController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      targetAddress,
      status,
      alertType,
      notificationType,
      thresholdValue,
      webhookUrl,
    } = req.body;
    console.log(req.user)
    const userId = req.user?.id;

    AlertRuleValidations.validateEthereumAddress(targetAddress);

    const alertTypeRecord =
      await AlertRuleValidations.findAlertTypeRecord(alertType);
 

    const alertRuleStatus = AlertRuleValidations.convertAlertStatusEnum(status);

    const user = await AlertRuleValidations.findUser(userId!);
    let validatedThreshold: bigint | null = null;

    if (thresholdValue !== undefined && thresholdValue !== null) {
      validatedThreshold =
        AlertRuleValidations.validateThresholdValue(thresholdValue);
    }

    if (notificationType === NotificationType.WEBHOOK && !webhookUrl) {
      throw new Error("Webhook URL is required");
    }

    const alertRule = new AlertRule();
    alertRule.user = user;
    alertRule.alertType = alertTypeRecord;
    alertRule.targetAddress = targetAddress.toLowerCase();
    alertRule.alertRuleStatus = alertRuleStatus;
    alertRule.notificationType = notificationType || NotificationType.EMAIL;
    alertRule.isActive = true;
    alertRule.thresholdValue = validatedThreshold!;
    alertRule.webhookUrl = webhookUrl;

    await alertRule.save();

    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      data: AlertRuleResponseDto.from(alertRule),
    });
  } catch (error) {
    next(error);
  }
}

export default CreateEthAlertController;
