import { Request, Response, NextFunction } from "express";
import RegistrationRequest from "../interfaces";
import { User } from "../../../../../db/entities/User";
import { JwtService } from "../../../../../core/services/jwt/jwtService";


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
      userId: createdUser.id,
      email: createdUser.email,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}