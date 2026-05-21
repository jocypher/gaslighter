import Joi from "joi";

export const validateChangePasswordSchema = Joi.object({
    password: Joi.string().required().messages({
            "string.empty": "Password required",
     }),
})