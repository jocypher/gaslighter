import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../../../../core/middlewares/authMiddlewares';
import { FindOptionsWhere } from 'typeorm';
import { AlertHistory } from '../../../../../db/entities/AlertHistory';
import { AlertHistoryStatus } from '../../../../../core/enums/alertHistoryStatus';
import appConstants from '../../../../../core/constants/appConstants';
import { AlertHistoryResponseDto } from '../dto';

export default async function ListAlertHistoryController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Number(req.query.pageNumber) || 1;
    const limit = Number(req.query.pageSize) || 10;
    const query = req.query.query as string;
    const skip = (page - 1) * limit;

    // const where:
    //   | FindOptionsWhere<AlertHistory>
    //   | FindOptionsWhere<AlertHistory>[] = {
    //   status: AlertHistoryStatus.SENT,
    // };
    const qb = AlertHistory.createQueryBuilder('alertHistory')
      .leftJoin('alertHistory.alertRule', 'alertRule')
      .where('alert.status= :status', {
        status: AlertHistoryStatus.SENT,
      });

    if (query) {
      const trimmedQuery = `%${query.trim()}%`;
      qb.andWhere(
        `
        (
        "alertHistory"."triggeredAt" ILIKE :search
        OR
        "alertHistory"."eventData" ILIKE :search
        )
        `,
        {
          search: trimmedQuery,
        },
      );
    }
    const [alertHistories, total] = await qb.skip(skip).take(limit).getManyAndCount();

    if (total == 0) {
      return res.status(appConstants.STATUS_CODE.SUCCESS).json({
        success: false,
        message: 'No alert history available',
      });
    }
    const alertHistoryResponse = alertHistories.map((alertHistory) =>
      AlertHistoryResponseDto.from(alertHistory),
    );
    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      data: alertHistoryResponse,
      dataInfo: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}
