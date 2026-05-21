import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../core/middlewares/authMiddlewares";
import { FindOptionsWhere, ILike } from "typeorm";
import { AlertHistory } from "../../../../../db/entities/AlertHistory";
import { AlertHistoryStatus } from "../../../../../core/enums/alertHistoryStatus";
import appConstants from "../../../../../core/constants/appConstants";
import { AlertHistoryResponseDto } from "../dto";

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

    let where:
      | FindOptionsWhere<AlertHistory>
      | FindOptionsWhere<AlertHistory>[] = {
      status: AlertHistoryStatus.SENT,
    };

    if (query) {
      const trimmedQuery = `%${query}%`.trim();
      where = [
        {
          triggeredAt: ILike(new Date(trimmedQuery)),
        },
      ];
    }
    const [alertHistories, total] = await AlertHistory.findAndCount({
      where,
      relations: {
        alertRule: true,
      },
      select: {
        alertRule: true,
        triggeredAt: true,
        eventData: true,
        deliveredAt: true,
      },
      skip: skip,
      take: limit,
    });

    if (total == 0) {
      return res.status(appConstants.statusCode.SUCCESS).json({
        success: false,
        message: "No alert history available",
      });
    }
    const alertHistoryResponse = alertHistories.map((alertHistory)=> AlertHistoryResponseDto.from(alertHistory))
    return res.status(appConstants.statusCode.SUCCESS).json({
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
