import express from "express";
import RegisterController from "./register/controllers/registerController";
import { LoginController } from "./login/controllers/loginController";
import DeleteUserController from "./delete/controllers/DeleteUserController";

const router = express.Router();

router.post("/register", RegisterController);

router.post("/login", LoginController);

router.post("/delete", DeleteUserController);

export default router;
