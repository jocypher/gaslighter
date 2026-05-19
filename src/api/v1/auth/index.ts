import express from "express";
import RegisterController from "./register/controllers/registerController";
import { LoginController } from "./login/controllers/loginController";
import DeleteUserController from "./delete/controllers/DeleteUserController";
import { validateRegisterSchema } from "./register/validation";
import validate from "../../../core/middlewares/joiMiddlewares";
import { validateLoginSchema } from "./login/validation";


const router = express.Router();

router.post("/register", 
    validate(validateRegisterSchema),
    RegisterController);

router.post("/login",
    validate(validateLoginSchema),
    LoginController);

router.post("/delete", DeleteUserController);

export default router;
