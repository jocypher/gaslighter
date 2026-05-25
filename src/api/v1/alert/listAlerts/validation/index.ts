import Joi from "joi";

export const validateListAlertSchema = Joi.object({
    search: Joi.string().optional().messages({
        "string.any":"search query is required"
    }),
    page:Joi.number().required().messages({
        "number.any":"page value is required"
    }),
    limit: Joi.number().required().messages({
        "number.any":"limit value is required"
    })
});

