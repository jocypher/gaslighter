import { Request, Response, NextFunction } from "express";
import RegistrationRequest from "../interfaces";
import { User } from "../../../../../db/entities/User";
import { JwtService } from "../../../../../core/services/jwt/jwtService";
import sendRegisterMail from "../../../../../core/mail/sendRegisterMail";

export default async function RegisterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, email, password } = req.body as RegistrationRequest;

    const existingUser = await User.findOne({
      where: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const createdUser = User.create({
      username: username,
      email,
      password,
    });

    await createdUser.save();

    const accessToken = JwtService.generateToken({
      id: createdUser.id,
      email: createdUser.email,
    });

    res.status(201).json({
      success: true,
      data: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
      },
      accessToken,
    });

    sendRegisterMail({ name: createdUser.username }).catch((error) => {
      console.error(`Failed to send email`);
      const err = new Error("Failed to send register mail");
      (err as any).cause = error;
      throw err;
    });
  } catch (error) {
    next(error);
  }
}
