import Joi from "joi";

export const validateListAlertSchema = Joi.object({
    query: Joi.string().required().messages({
        "string.empty":"search query cannot be empty",
        "string.any":"search query is required"
    }),
    page:Joi.number().required().messages({
        "number.any":"page value is required"
    }),
    limit: Joi.number().required().messages({
        "number.any":"limit value is required"
    })
});

