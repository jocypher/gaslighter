
import express from "express"
import authRouter from "./auth/index"
import alertRouter from "./alert/index"
import profileRouter from "./profile/index"
const router = express.Router()


router.use("/auth", 
    authRouter)

router.use("/profile", profileRouter)

router.use("/alert", alertRouter)

export default router