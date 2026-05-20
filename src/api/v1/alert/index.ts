import { Router } from "express";
import { authenticate } from "../../../core/middlewares/authMiddlewares";
import validate from "../../../core/middlewares/joiMiddlewares";
import { validateCreateEthBalanceAlertSchema } from "./createAlert/walletBalanceAlert/validation";
import CreateEthBalanceAlertController from "./createAlert/walletBalanceAlert/controllers/ethBalanceAlertController";
import GetEthWalletBalance from "../../../core/chain/eth/getWalletBalance/getWalletBalance";
import { valid } from "joi";
import { validateIncomingEthAlertSchema } from "./createAlert/incomingEthAlert/validation";
import IncomingEthAlertController from "./createAlert/incomingEthAlert/controllers/incomingEthAlertController";

const router = Router();

router.post(
  "/rules/eth-balance",
  authenticate,
  validate(validateCreateEthBalanceAlertSchema),
  CreateEthBalanceAlertController,
);

router.post(
  "/rules/incoming-eth",
  authenticate,
  validate(validateIncomingEthAlertSchema),
  IncomingEthAlertController
)
router.get(
    "/eth-balance",
    authenticate,
    GetEthWalletBalance
)


export default router