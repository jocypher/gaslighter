import Joi from 'joi';
import { NotificationType } from '../../../../../core/enums/notificationType';
import { AlertRuleStatus } from '../../../../../core/enums/alertRuleStatus';
import { addressValidator } from '../../../../../core/utils/validators';

export const validateUpdateAlertSchema = Joi.object({
  targetAddress: Joi.string().custom(addressValidator, 'Ethereum address must be valid').required(),
  status: Joi.string()
    .valid(...Object.values(AlertRuleStatus))
    .required()
    .messages({
      'string.empty': 'status cannot be empty ',
    }),
  alertType: Joi.string().required().messages({
    'string.any': 'Rule type is required',
  }),
  notificationType: Joi.string()
    .case('lower')
    .valid(...Object.values(NotificationType))
    .required()
    .messages({
      'string.any': 'Notification type is required',
    }),
  thresholdValue: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .custom((val) => BigInt(val))
    .messages({
      'string.pattern.base': '"thresholdValue" must be a valid, positive whole number (Gwei).',
      'any.required': '"thresholdValue" is a required field.',
    }),
  webhookUrl: Joi.string().optional().messages({
    'string.any': 'webhook string required',
  }),
});
