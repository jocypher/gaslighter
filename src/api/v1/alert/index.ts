import { Router } from "express";
import { authenticate } from "../../../core/middlewares/authMiddlewares";
import validate from "../../../core/middlewares/joiMiddlewares";

import ListAlertsControllers from "./listAlerts/controllers/listAlertsControllers";
import { validateListAlertSchema } from "./listAlerts/validation";
import { validateGetAlertById } from "./getAlertById/validation";
import GetAlertByIdController from "./getAlertById/controllers/getAlertByIdController";

import { validateUpdateAlertSchema } from "./updateAlert/validation";
import UpdateAlertController from "./updateAlert/controllers/updateAlertControllers";
import { validateDeleteParamId } from "./deleteAlert/validations";
import { validateCreateEthAlertSchema } from "./createAlert/validation";
import CreateEthAlertController from "./createAlert/controllers/createEthAlertController";

const router = Router();

router.post(
  "/",
  validate(validateCreateEthAlertSchema),
  CreateEthAlertController,
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

router.patch(
  "/:id",
  authenticate,
  validate(validateGetAlertById, "params"),
  validate(validateUpdateAlertSchema),
  UpdateAlertController,
);

router.delete("/:id", authenticate, validate(validateDeleteParamId, "params"));
export default router;
