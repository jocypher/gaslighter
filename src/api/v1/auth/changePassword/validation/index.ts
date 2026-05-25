import Joi from "joi";

export const validateChangePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old password is required",
  }),

  newPassword: Joi.string()
    .min(8)
    .max(30)
    .disallow(Joi.ref("oldPassword"))
    .required()
    .messages({
      "string.min": "New password must be at least 8 characters long",
      "any.invalid": "New password cannot be the same as the old password",
    }),
});