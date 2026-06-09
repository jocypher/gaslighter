import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../../../../core/middlewares/authMiddlewares';
import { AlertRule } from '../../../../../db/entities/AlertRule';
import appConstants from '../../../../../core/constants/appConstants';

export default async function DeleteAlertController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const alertId = Number(req.params.id);
    const alert = await AlertRule.findOne({
      where: {
        id: alertId,
      },
    });
    if (!alert) {
      return res.status(appConstants.STATUS_CODE.SUCCESS).json({
        success: false,
        message: 'Alert not found',
      });
    }
    await AlertRule.delete(alertId);

    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
