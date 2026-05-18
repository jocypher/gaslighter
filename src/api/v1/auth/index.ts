import express from "express"
import RegisterController from "./register/controllers/registerController"
import { LoginController } from "./login/controllers/loginController"

const router = express.Router()

router.post(
    "/register",
    RegisterController
)

router.post(
    "/login",
    LoginController
)


export default router