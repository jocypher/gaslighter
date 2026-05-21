import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../core/middlewares/authMiddlewares";
import { AlertRule } from "../../../../../db/entities/AlertRule";
import appConstants from "../../../../../core/constants/appConstants";
import UpdateAlertRequest from "../interfaces";
import { AlertType } from "../../../../../db/entities/AlertType";

export default async function UpdateAlertController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const alertId = Number(req.params.id);
    const {
      targetAddress,
      thresholdValue,
      alertStatus,
      notificationType,
      webhookUrl,
      alertTypeName,
    } = req.body as UpdateAlertRequest;

    const alert = await AlertRule.findOne({
      where: {
        id: alertId,
      },
      relations: {
        user: true,
        alertHistories: true,
      },
      select: {
        targetAddress: true,
        thresholdValue: true,
        alertRuleStatus: true,
        notificationType: true,
        webhookUrl: true,
        alertType: true,
      },
    });

    if (!alert) {
      return res.status(appConstants.statusCode.NOTFOUND).json({
        success: false,
        message: "Alert not found",
      });
    }
    if (targetAddress !== undefined) {
      alert.targetAddress = targetAddress.toLowerCase().trim();
    }
    if (thresholdValue !== undefined) {
      alert.thresholdValue = thresholdValue;
    }
    if (alertStatus !== undefined) {
      alert.alertRuleStatus = alertStatus;
    }
    if (notificationType !== undefined) {
      alert.notificationType = notificationType;
    }
    if (webhookUrl !== undefined) {
      alert.webhookUrl = webhookUrl;
    }
    if (alertTypeName !== undefined) {
      const alertType = await AlertType.findOne({
        where: {
          type: alertTypeName,
        },
      });
      if (!alertType) {
        return res.status(appConstants.statusCode.SUCCESS).json({
          success: false,
          message: "alert type not found",
        });
      }
      alert.alertType = alertType;
    }

    await alert.save();
    return res.status(appConstants.statusCode.SUCCESS).json({
        success:true,
        message:"Alert updated successfully"
    })
  } catch (error) {
    next(error);
  }
}
