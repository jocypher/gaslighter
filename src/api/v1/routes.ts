
import express from "express"
import auth from "./auth/index"

const router = express.Router()


router.use("/auth", 
    auth)

router.use("/profile")

export default router