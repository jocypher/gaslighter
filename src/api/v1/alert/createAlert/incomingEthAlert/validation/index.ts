import { getAddress } from "ethers";
import Joi from "joi";
import { AlertRuleStatus } from "../../../../../../core/enums/alertRuleStatus";
import { NotificationType } from "../../../../../../core/enums/notificationType";

const addressValidator = (value: any, helpers: any) => {
  try {
    if (getAddress(value)) {
      return value;
    }
  } catch (err) {
    return helpers.error("any.invalid");
  }
};

export const validateIncomingEthAlertSchema = Joi.object({
  targetAddress: Joi.string()
    .custom(addressValidator, "Ethereum address must be valid")
    .required(),
  status: Joi.string()
    .valid(...Object.values(AlertRuleStatus))
    .required()
    .messages({
      "string.empty": "status cannot be empty ",
    }),
  ruleType: Joi.string().required().messages({
    "string.any": "Rule type is required",
  }),
  notificationType: Joi.string()
    .case("lower")
    .valid(...Object.values(NotificationType))
    .required()
    .messages({
      "string.any": "Notification type is required",
    }),
  thresholdValue: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .custom((val) => BigInt(val))
    .messages({
      "string.pattern.base":
        '"thresholdValue" must be a valid, positive whole number (Gwei).',
      "any.required": '"thresholdValue" is a required field.',
    }),
});
