import { NextFunction, Response } from 'express';
import { User } from '../../../../../db/entities/User';
import appConstants from '../../../../../core/constants/appConstants';
import { AuthRequest } from '../../../../../core/middlewares/authMiddlewares';
import { ProfileResponseDto } from '../dto';

export default async function GetProfileController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.user?.id;
    console.log(req?.user);
    console.log(id);
    if (!id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session',
      });
    }

    const user = await User.findOne({
      where: {
        id: id!,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdDate: true,
      },
    });

    if (!user) {
      return res.status(appConstants.STATUS_CODE.SUCCESS).json({
        success: false,
        message: 'User not found',
      });
    }

    const userResponse = ProfileResponseDto.from(user);

    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    return next(error);
  }
}
