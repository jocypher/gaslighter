import Joi from "joi";
import { AlertRuleStatus } from "../../../../../../core/enums/alertRuleStatus";

export const validateCreateEthBalanceAlertSchema = Joi.object({
  rule_type: Joi.string().required().messages({
    "string.empty": "rule type can't be empty",
    "string.required": "rule type is required",
  }),
  targetAddress: Joi.string().required().messages({
    "string.empty": "Wallet Address can't be empty",
    "string.required": "Wallet Address is required",
  }),
  status: Joi.string().valid(...Object.values(AlertRuleStatus)).required().messages({
    'string.empty':'Status is required'
  }),
  thresholdValue: Joi.number().required().messages({
    'number.empty':'Threshold value cannot be empty'
  }),
  notificationType: Joi.string().optional().messages({
    'string.any':'notification type must be email / webhook'
  }),
});
