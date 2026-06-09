import Joi from 'joi';
import { addressValidator } from '../../../../../core/utils/validators';
import { AlertRuleStatus } from '../../../../../core/enums/alertRuleStatus';
import appConstants from '../../../../../core/constants/appConstants';
import { NotificationType } from '../../../../../core/enums/notificationType';

export const validateCreateEthAlertSchema = Joi.object({
  targetAddress: Joi.string()
    .custom(addressValidator, 'Ethereum address must be valid')
    .required()
    .messages({
      'string.empty': 'Target address is required',
      'any.required': 'Target address is required',
    }),
  // status: Joi.string()
  //   .valid(...Object.values(AlertRuleStatus))
  //   .required()
  //   .messages({
  //     "string.empty": "Status cannot be empty",
  //     "any.only": "Invalid alert rule status",
  //     "any.required": "Status is required",
  //   }),
  status: Joi.alternatives().conditional('alertRuleStatus', {
    is:
      appConstants.ALERT_TYPE_NAMES.LARGE_TRANSACTION ||
      appConstants.ALERT_TYPE_NAMES.TOKEN_TRANSFER ||
      appConstants.ALERT_TYPE_NAMES.CONTRACT_INTERACTION,

    then: Joi.string()
      .valid(...Object.values(AlertRuleStatus))
      .required()
      .messages({
        'string.empty': 'Status cannot be empty',
        'any.only': 'Invalid alert rule status',
        'any.required': 'Status is required',
      }),
    otherwise: Joi.string().optional(),
  }),
  alertType: Joi.string()
    .valid(...Object.values(appConstants.ALERT_TYPE_NAMES))
    .required()
    .messages({
      'string.empty': 'Alert type cannot be empty',
      'any.only': 'Invalid alert type',
      'any.required': 'Alert type is required',
    }),

  notificationType: Joi.string()
    .lowercase()
    .valid(...Object.values(NotificationType))
    .required()
    .messages({
      'string.empty': 'Notification type cannot be empty',
      'any.only': 'Invalid notification type',
      'any.required': 'Notification type is required',
    }),

  thresholdValue: Joi.alternatives().conditional('alertType', {
    is:
      appConstants.ALERT_TYPE_NAMES.WALLET_BALANCE ||
      appConstants.ALERT_TYPE_NAMES.LARGE_TRANSACTION ||
      appConstants.ALERT_TYPE_NAMES.TOKEN_TRANSFER ||
      appConstants.ALERT_TYPE_NAMES.GAS_PRICE,
    then: Joi.number().positive().required().messages({
      'number.base': 'Threshold value must be a number',
      'number.positive': 'Threshold value must be greater than 0',
      'any.required': 'Threshold value is required for wallet balance alerts',
    }),

    otherwise: Joi.number().positive().optional(),
  }),

  webhookUrl: Joi.alternatives().conditional('notificationType', {
    is: NotificationType.WEBHOOK,
    then: Joi.string().uri().required().messages({
      'string.uri': 'Webhook URL must be valid',
      'any.required': 'Webhook URL is required for webhook notifications',
    }),

    otherwise: Joi.string().uri().optional().allow(null, ''),
  }),
});
