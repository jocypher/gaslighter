import Joi from "joi";

export const validateWalletBalanceSchema = Joi.object({
    address: Joi.string().required().messages({
        'string.any':'Address is required'
    })
})