import Joi from "joi";

const ChangePasswordSchema = Joi.object({
    password: Joi.string().required().messages({
            "string.empty": "Password required",
     }),
})