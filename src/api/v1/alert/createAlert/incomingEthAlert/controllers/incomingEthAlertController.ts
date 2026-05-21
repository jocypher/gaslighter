import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../../core/middlewares/authMiddlewares";
import appConstants from "../../../../../../core/constants/appConstants";
import { AlertRule } from "../../../../../../db/entities/AlertRule";
import { NotificationType } from "../../../../../../core/enums/notificationType";
import { AlertRuleValidations } from "../../../../../../core/utils/alertRuleValidation";
import { AlertRuleResponseDto } from "../../../../../../core/utils/sharedDto";


async function CreateIncomingEthAlertController(
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
    } = req.body;
    const userId = req.user!.id;
    
    AlertRuleValidations.validateEthereumAddress(targetAddress)
    const alertTypeRecord = await AlertRuleValidations.findAlertTypeRecord(alertType)
    console.log(alertTypeRecord)
    const alertRuleStatus = AlertRuleValidations.convertAlertStatusEnum(status)
    const user = await AlertRuleValidations.findUser(userId)
    const threshold = AlertRuleValidations.validateThresholdValue(thresholdValue)

    const alertRule = new AlertRule();
    alertRule.user = user;
    alertRule.alertType = alertTypeRecord;
    alertRule.targetAddress = targetAddress.toLowerCase();
    alertRule.alertRuleStatus = alertRuleStatus;
    alertRule.thresholdValue = threshold;
    alertRule.notificationType = notificationType || NotificationType.EMAIL;
    alertRule.isActive = true;

    await alertRule.save();

    return res.status(appConstants.statusCode.SUCCESS).json({
      success: true,
      data: AlertRuleResponseDto.from(alertRule)
    });
  } catch (error) {
    next(error);
  }
}

export default CreateIncomingEthAlertController
