import Joi from 'joi';

export const validateGetAlertById = Joi.object({
  alertId: Joi.number().required().messages({
    'number.any': 'Alert id is required',
  }),
});
