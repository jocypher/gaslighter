import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../../core/middlewares/authMiddlewares";
import appConstants from "../../../../../../core/constants/appConstants";
import { AlertRule } from "../../../../../../db/entities/AlertRule";
import { NotificationType } from "../../../../../../core/enums/notificationType";
import { AlertRuleResponseDto } from "../../../../../../core/utils/sharedDto";
import { AlertRuleValidations } from "../../../../../../core/utils/alertRuleValidation";

async function CreateEthBalanceAlertController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      alertType,
      targetAddress,
      status,
      thresholdValue,
      notificationType,
    } = req.body;
    const userId = req.user!.id;

    AlertRuleValidations.validateEthereumAddress(targetAddress);

    const alertTypeRecord =
      await AlertRuleValidations.findAlertTypeRecord(alertType);

    const alertRuleStatus = AlertRuleValidations.convertAlertStatusEnum(status);
    const validThresholdValue =
      AlertRuleValidations.validateThresholdValue(thresholdValue);
    const user = await AlertRuleValidations.findUser(userId);

    const alertRule = new AlertRule();
    alertRule.user = user;
    alertRule.alertType = alertTypeRecord;
    alertRule.targetAddress = targetAddress.toLowerCase();
    alertRule.alertRuleStatus = alertRuleStatus;
    alertRule.thresholdValue = validThresholdValue;
    alertRule.notificationType = notificationType || NotificationType.EMAIL;
    alertRule.isActive = true;

    await alertRule.save();
    return res.status(appConstants.statusCode.SUCCESS).json({
      success: true,
      data: AlertRuleResponseDto.from(alertRule),
    });
  } catch (error) {
    next(error);
  }
}

export default CreateEthBalanceAlertController;
