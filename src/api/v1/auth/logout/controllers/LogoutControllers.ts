import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../core/middlewares/authMiddlewares";
import { User } from "../../../../../db/entities/User";
import appConstants from "../../../../../core/constants/appConstants";

async function LogoutController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.user?.id as string;

    const user = await User.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      return res.status(appConstants.STATUS_CODE.SUCCESS).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: false,
      message: "User Logged Out successfully",
    });
  } catch (error) {
    console.log("Error is ", error);
    next(error);
  }
}

export default LogoutController;
