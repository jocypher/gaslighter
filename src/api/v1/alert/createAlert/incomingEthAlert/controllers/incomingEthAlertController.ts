import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../../core/middlewares/authMiddlewares";
import { AlertType } from "../../../../../../db/entities/AlertType";
import appConstants from "../../../../../../core/constants/appConstants";
import { AlertRuleStatus } from "../../../../../../core/enums/alertRuleStatus";
import { AlertRule } from "../../../../../../db/entities/AlertRule";
import { User } from "../../../../../../db/entities/User";
import { NotificationType } from "../../../../../../core/enums/notificationType";

async function IncomingEthAlertController(
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

    const alertTypeRecord = await AlertType.findOne({
      where: {
        type: alertType,
      },
    });
    if (!alertTypeRecord) {
      return res.status(appConstants.statusCode.SUCCESS).json({
        success: false,
        messages: "Alert rule Type not fund",
      });
    }

    let alertRuleStatus: AlertRuleStatus;

    switch (status) {
      case "greater_than":
        alertRuleStatus = AlertRuleStatus.GREATER_THAN;
        break;
      case "less_than":
        alertRuleStatus = AlertRuleStatus.LESS_THAN;
        break;
      case "equals":
        alertRuleStatus = AlertRuleStatus.EQUALS;
        break;
      default:
        return res.status(appConstants.statusCode.SUCCESS).json({
          success: false,
          message: "Invalid condition. Use: greater_than, less_than, or equals",
        });
    }

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(appConstants.statusCode.SUCCESS).json({
        success: false,
        message: "User not found",
      });
    }

    const alertRule = new AlertRule();
    alertRule.user = user;
    alertRule.alertType = alertTypeRecord;
    alertRule.targetAddress = targetAddress.toLowerCase();
    alertRule.alertRuleStatus = alertRuleStatus;
    alertRule.thresholdValue = BigInt(thresholdValue);
    alertRule.notificationType = notificationType || NotificationType.EMAIL;
    alertRule.isActive = true;

    await alertRule.save();

    return res.status(appConstants.statusCode.SUCCESS).json({
      success: true,
      data: {
        id: alertRule.id,
        targetAddress: alertRule.targetAddress,
        condition: status,
        thresholdValue: thresholdValue,
        notificationType: alertRule.notificationType,
        isActive: alertRule.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
}
