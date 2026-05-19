import Joi from "joi";

export const UpdateProfileSchema = Joi.object({
     username: Joi.string()
    .min(4)
    .max(20)
    .messages({
      "string.empty": "Display name cannot be empty",
      "string.min": "Min 6 characters",
    })
    .required(),
})