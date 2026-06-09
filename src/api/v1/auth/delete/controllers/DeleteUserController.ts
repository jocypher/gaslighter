import { NextFunction, Response } from 'express';
import { User } from '../../../../../db/entities/User';
import appConstants from '../../../../../core/constants/appConstants';
import { AuthRequest } from '../../../../../core/middlewares/authMiddlewares';

export default async function DeleteUserController(
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
        isDeleted: true,
        deletedAt: true,
      },
    });
    if (!user) {
      return res.status(appConstants.STATUS_CODE.NOTFOUND).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    if (user.isDeleted) {
      user.deletedAt = new Date(Date.now());
    }

    return res.status(appConstants.STATUS_CODE.SUCCESS).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
