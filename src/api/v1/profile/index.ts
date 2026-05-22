import { Router } from "express";
import GetProfileController from "./getProfile/controllers/getProfileController";
import { authenticate } from "../../../core/middlewares/authMiddlewares";
import UpdateProfileController from "./updateProfile/controllers/updateProfileControllers";
import validate from "../../../core/middlewares/joiMiddlewares";
import { UpdateProfileSchema } from "./updateProfile/validation";

const router = Router();

router.get("/", authenticate, GetProfileController);

router.put(
  "/update",
  authenticate,
  validate(UpdateProfileSchema),
  UpdateProfileController,
);

export default router;
