import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../../core/middlewares/authMiddlewares";
import { AlertType } from "../../../../../../db/entities/AlertType";
import appConstants from "../../../../../../core/constants/appConstants";
import { AlertRule } from "../../../../../../db/entities/AlertRule";
import { ethers, id } from "ethers";
import { AlertRuleStatus } from "../../../../../../core/enums/alertRuleStatus";

async function CreateEthBalanceAlertController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      rule_type,
      targetAddress,
      status,
      thresholdValue,
      notificationType,
    } = req.body;
    const userId = req.user!.id;

    if (!ethers.isAddress(targetAddress)) {
      return res.status(appConstants.statusCode.UNAUTHORIZED).json({
        success: false,
        message: `Invalid wallet Address ${targetAddress}`,
      });
    }
    const rule = await AlertType.findOne({
      where: {
        type: rule_type,
      },
      select: {
        id: true,
      },
    });
    if (!rule) {
      return res.status(appConstants.statusCode.SUCCESS).json({
        success: false,
        message: `Alert Type  ${rule_type} doesn't exist`,
      });
    }

    let ruleStatus: AlertRuleStatus;

    switch (status) {
      case "greater_than":
        ruleStatus = AlertRuleStatus.GREATER_THAN;
        break;
      case "less_than":
        ruleStatus = AlertRuleStatus.LESS_THAN;
        break;
      case "equals":
        ruleStatus = AlertRuleStatus.EQUALS;
        break;
      default:
        return res.status(appConstants.statusCode.SUCCESS).json({
          success: false,
          message: "Invalid condition. Use: greater_than, less_than, or equals",
        });
    }

    const alertRule = AlertRule.create({
      user: { id: userId } as any,
      alertType: rule_type,
      targetAddress: targetAddress,
      alertRuleStatus: ruleStatus,
      thresholdValue: BigInt(thresholdValue),
      notificationType: notificationType,
      isActive: true,
    });

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


export default CreateEthBalanceAlertController
