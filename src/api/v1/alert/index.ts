import { Router } from "express";
import { authenticate } from "../../../core/middlewares/authMiddlewares";
import validate from "../../../core/middlewares/joiMiddlewares";
import { validateCreateEthBalanceAlertSchema } from "./createAlert/walletBalanceAlert/validation";
import CreateEthBalanceAlertController from "./createAlert/walletBalanceAlert/controllers/ethBalanceAlertController";
import GetEthWalletBalance from "../../../core/chain/eth/getWalletBalance/getWalletBalance";

const router = Router();

router.post(
  "/rules/eth-balance",
  authenticate,
  validate(validateCreateEthBalanceAlertSchema),
  CreateEthBalanceAlertController,
);

router.get(
    "/eth-balance",
    authenticate,
    GetEthWalletBalance
)


export default router