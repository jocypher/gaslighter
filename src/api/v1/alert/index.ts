import { Router } from "express";
import { authenticate } from "../../../core/middlewares/authMiddlewares";
import validate from "../../../core/middlewares/joiMiddlewares";
import { validateCreateEthBalanceAlertSchema } from "./createAlert/walletBalanceAlert/validations";
import CreateEthBalanceAlertController from "./createAlert/walletBalanceAlert/controllers/ethBalanceAlertController";

const router = Router();

router.post(
  "/rules/eth-balance",
  authenticate,
  validate(validateCreateEthBalanceAlertSchema),
  CreateEthBalanceAlertController,
);

router.get(
    "/eth-balance",
    authenticate
)


export default router