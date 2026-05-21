import Joi from "joi";

export const validateDeleteParamId = Joi.object({
  alertId: Joi.number().integer().positive().required().messages({
    "number.base": "id must be a number",
    "number.integer": "id must be an integer",
    "number.positive": "id must be greater than 0",
    "any.required": "id is required",
  }),
});
