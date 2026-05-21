import { Router } from "express";
import { authenticate } from "../../../core/middlewares/authMiddlewares";
import validate from "../../../core/middlewares/joiMiddlewares";
import { validateCreateEthBalanceAlertSchema } from "./createAlert/walletBalanceAlert/validation";
import CreateEthBalanceAlertController from "./createAlert/walletBalanceAlert/controllers/ethBalanceAlertController";
import { validateIncomingEthAlertSchema } from "./createAlert/incomingEthAlert/validation";
import ListAlertsControllers  from "./listAlerts/controllers/listAlertsControllers";
import { validateListAlertSchema } from "./listAlerts/validation";
import { validateGetAlertById } from "./getAlertById/validation";
import GetAlertByIdController from "./getAlertById/controllers/getAlertByIdController";
import CreateIncomingEthAlertController from "./createAlert/incomingEthAlert/controllers/incomingEthAlertController";

const router = Router();

router.post(
  "/eth-balance",
  authenticate,
  validate(validateCreateEthBalanceAlertSchema),
  CreateEthBalanceAlertController,
);

router.post(
  "/incoming-eth",
  authenticate,
  validate(validateIncomingEthAlertSchema),
  CreateIncomingEthAlertController,
);

router.get(
  "/",
  authenticate,
  validate(validateListAlertSchema, "query"),
  ListAlertsControllers,
);

router.get(
  "/:id",
  authenticate,
  validate(validateGetAlertById, "params"),
  GetAlertByIdController,
);

export default router;
