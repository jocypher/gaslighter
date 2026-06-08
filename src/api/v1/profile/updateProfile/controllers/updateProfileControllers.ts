import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../core/middlewares/authMiddlewares";
import { User } from "../../../../../db/entities/User";
import appConstants from "../../../../../core/constants/appConstants";

async function UpdateProfileController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.user?.id;
    const { username } = req.body;

    const user = await User.findOne({
      where: {
        id: id!,
        isDeleted: false,
      },
      select: {
        id: true,
        username: true,
      },
    });
    if (!user) {
      return res.status(appConstants.STATUS_CODE.SUCCESS).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.username !== null) {
      user.username = username;
    }
    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Username changed successfully",
    });
  } catch (error) {
    next(error);
  }
}

export default UpdateProfileController;
