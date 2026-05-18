import { NextFunction, Request, Response } from "express";
import { User } from "../../../../../db/entities/User";
import appConstants from "../../../../../core/constants/appConstants";
import LoginRequest from "../interfaces";

export async function LoginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body as LoginRequest;
    //todo:Joi validation on the schema
    const user = await User.findOne({
      where: {
        email: email,
      },
      select: {
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(appConstants.statusCode.SUCCESS).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const validatePassword = user.validatePassword(password);

    if (!validatePassword) {
      return res.status(appConstants.statusCode.UNAUTHORIZED).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    return res.status(appConstants.statusCode.SUCCESS).json({
      success: true,
      message: "Logged In successfully",
    });
  } catch (error) {
    next(error);
  }
}
