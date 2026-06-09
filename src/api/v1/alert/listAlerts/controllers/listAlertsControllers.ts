import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../core/middlewares/authMiddlewares";
import { AlertRule } from "../../../../../db/entities/AlertRule";
import appConstants from "../../../../../core/constants/appConstants";
import { AlertRuleResponseDto } from "../../../../../core/utils/sharedDto";

export default async function ListAlertsControllers(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const search = req.query.search as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = AlertRule.createQueryBuilder("alert")
      .leftJoinAndSelect("alert.alertType", "alertType")
      .leftJoinAndSelect("alert.user", "user")
      .leftJoinAndSelect("alert.alertHistories", "alertHistories")
      .where("alert.isActive= :isActive", { isActive: true });

    if (search && search !== "") {
      const cleanedSearch = search.trim();

      const trimmedQuery = `%${cleanedSearch}%`;
      qb.andWhere(
        `
        (
          "alertType"."type" ILIKE :search 
          OR "alert"."targetAddress" ILIKE :search
        )
        `,
        {
          search: trimmedQuery,
        },
      );
    }

    const [alertRules, total] = await qb
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    console.log(alertRules);

    if (alertRules.length == 0) {
      return res.status(appConstants.STATUS_CODE.SUCCESS).json({
        success: false,
        message: "No alert rules found",
        data: [],
      });
    }
    console.log(alertRules);
    const response = alertRules.map((alertRule) =>
      AlertRuleResponseDto.from(alertRule),
    );
    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      data: response,
      pageInfo: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
}
