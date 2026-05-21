import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../core/middlewares/authMiddlewares";
import { FindOptionsWhere, ILike, In } from "typeorm";
import { AlertRule } from "../../../../../db/entities/AlertRule";
import appConstants from "../../../../../core/constants/appConstants";
import { AlertRuleResponseDto } from "../../../../../core/utils/sharedDto";

export default async function ListAlertsControllers(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = req.query.query as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let where: FindOptionsWhere<AlertRule> | FindOptionsWhere<AlertRule>[] = {};

    if (query) {
      where = [
        {
          alertType: ILike(query),
        },
        { targetAddress: ILike(query) },
        { isActive: true },
      ];
    }
    const alertRules = await AlertRule.find({
      where: where,
      relations: {
        user: true,
        alertHistories: true,
      },

      skip: skip,
      take: page,
    });

    if (alertRules.length == 0) {
      return res.status(appConstants.statusCode.SUCCESS).json({
        success: false,
        message: "User currently has not Alert rules",
      });
    }
    const response = alertRules.map((alertRule) =>
      AlertRuleResponseDto.from(alertRule),
    );
    return res.status(appConstants.statusCode.SUCCESS).json({
      success: true,
      data: response,
      pageInfo: {
        page,
        limit,
        skip,
      },
    });
  } catch (error) {
    next(error);
  }
}
