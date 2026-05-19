import { NextFunction, Request, Response } from "express";
import { User } from "../../../../../db/entities/User";
import appConstants from "../../../../../core/constants/appConstants";
import LoginRequest from "../interfaces";
import { JwtService } from "../../../../../core/services/jwt/jwtService";

export async function LoginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body as LoginRequest;
    const user = await User.findOne({
      where: {
        email: email,
      },
      select: {
        id: true,
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

    const validatePassword = await user.validatePassword(password);

    if (!validatePassword) {
      return res.status(appConstants.statusCode.UNAUTHORIZED).json({
        success: false,
        message: "Invalid Credentials",
      });
    }


    const accessToken = JwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return res.status(appConstants.statusCode.SUCCESS).json({
      success: true,
      message: "Logged In successfully",
      accessToken
    });
  } catch (error) {
    next(error);
  }
}
