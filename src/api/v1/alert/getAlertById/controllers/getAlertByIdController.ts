import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../core/middlewares/authMiddlewares";
import { AlertRule } from "../../../../../db/entities/AlertRule";
import appConstants from "../../../../../core/constants/appConstants";
import { AlertRuleResponseDto } from "../../../../../core/utils/sharedDto";

export default async function GetAlertByIdController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const alertId = Number(req.params.id);

    const alert = await AlertRule.findOne({
      where: [{ id: alertId }, { isActive: true }],
      relations: {
        user: true,
        alertHistories: true,
      },
    });
    if (!alert) {
      return res.status(appConstants.STATUS_CODE.NOTFOUND).json({
        success: false,
        message: "Alert not found",
      });
    }
    const alertResponse = AlertRuleResponseDto.from(alert);

    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      data: alertResponse,
    });
  } catch (error) {
    next(error);
  }
}
