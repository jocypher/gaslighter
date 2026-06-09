import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../../../../core/middlewares/authMiddlewares';
import { AlertHistory } from '../../../../../db/entities/AlertHistory';
import appConstants from '../../../../../core/constants/appConstants';
import { AlertHistoryResponseDto } from '../../listAlertHistories/dto';

export default async function GetAlertHistoryByIdController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const alertHistoryId = Number(req.params.id);

    const alertHistory = await AlertHistory.findOne({
      where: {
        id: alertHistoryId,
      },
      relations: {
        alertRule: true,
      },
    });
    if (!alertHistory) {
      return res.status(appConstants.STATUS_CODE.SUCCESS).json({
        success: false,
        message: 'Alert history not found',
      });
    }
    console.log(alertHistory);
    const alertHistoryResponse = AlertHistoryResponseDto.from(alertHistory);

    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      data: alertHistoryResponse,
    });
  } catch (error) {
    next(error);
  }
}
