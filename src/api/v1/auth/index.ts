import express from 'express';
import RegisterController from './register/controllers/RegisterController';
import { LoginController } from './login/controllers/loginController';
import DeleteUserController from './delete/controllers/DeleteUserController';
import { validateRegisterSchema } from './register/validation';
import validate from '../../../core/middlewares/joiMiddlewares';
import { validateLoginSchema } from './login/validation';
import LogoutController from './logout/controllers/LogoutControllers';
import { authenticate } from '../../../core/middlewares/authMiddlewares';
import ChangePasswordController from './changePassword/controllers/ChangePasswordController';
import { validateChangePasswordSchema } from './changePassword/validation';

const router = express.Router();

router.post('/register', validate(validateRegisterSchema), RegisterController);

router.post('/login', validate(validateLoginSchema), LoginController);

router.post('/delete', authenticate, DeleteUserController);

router.post('/logout', authenticate, LogoutController);

router.put(
  '/change-password',
  authenticate,
  validate(validateChangePasswordSchema),
  ChangePasswordController,
);

export default router;
