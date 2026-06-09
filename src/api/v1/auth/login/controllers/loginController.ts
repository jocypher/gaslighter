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
        username: true,
      },
    });

    if (!user) {
      return res.status(appConstants.STATUS_CODE.SUCCESS).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const validatePassword = await user.validatePassword(password);

    if (!validatePassword) {
      return res.status(appConstants.STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    console.log(user);

    const accessToken = JwtService.generateToken({
      id: user.id,
      email: user.email,
    });

    res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Logged In successfully",
      accessToken,
    });
    //  sendRegisterMail( { name: user.username }).catch((error) => {
    //     console.error(`Failed to send email`, error);
    //   });
  } catch (error) {
    next(error);
  }
}
