import { Request, Response, NextFunction } from "express";
import RegistrationRequest from "../interfaces";
import { User } from "../../../../../db/entities/User";
import appConstants from "../../../../../core/constants/appConstants";

export default async function RegisterController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, email, password } = req.body as RegistrationRequest;

    //todo: joi validation will be included to validate the request body
    

    const user = await User.find({
      where: [{ userName: username }, { email: email }],
    });

    if (user) {
      return res.status(appConstants.statusCode.UNAUTHORIZED).json({
        success: false,
        message: "User already exist",
      });
    }

    const createUser: Partial<User> = {
      userName: username,
      email: email,
      password: password,
      alertRules: [],
    };
    const createdUser = User.create(createUser);
    await createdUser.save();

    return res.status(appConstants.statusCode.SUCCESS).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(appConstants.statusCode.SUCCESS).json({
        success: false,
        message: "User already exists",
      });
    }
    next(error);
  }
}
