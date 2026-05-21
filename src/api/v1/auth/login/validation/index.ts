import Joi from "joi";

export const validateLoginSchema = Joi.object({
    email:Joi.string().email().required().messages({
        'string.empty':'Email is required',
        'string.any':'Invalid Email'
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password required",
 }),
})