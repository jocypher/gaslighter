import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../core/middlewares/authMiddlewares";
import { User } from "../../../../../db/entities/User";
import appConstants from "../../../../../core/constants/appConstants";

async function ChangePasswordController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({
      where: {
        id: id!,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return res
        .status(appConstants.statusCode.NOTFOUND)
        .json({ success: false, message: "User not found" });
    }

    const isOldPasswordCorrect = await user.validatePassword(oldPassword);

    if (!isOldPasswordCorrect) {
      return res.status(appConstants.statusCode.UNAUTHORIZED).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const isSameAsOld = await user.validatePassword(newPassword);

    if (isSameAsOld) {
      return res.status(appConstants.statusCode.SUCCESS).json({
        success: false,
        message: "New password cannot be the same as old password",
      });
    }
    user.password = newPassword;
    await user.save();

    return res.status(appConstants.statusCode.SUCCESS).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error is ", error);
    next(error);
  }
}

export default ChangePasswordController