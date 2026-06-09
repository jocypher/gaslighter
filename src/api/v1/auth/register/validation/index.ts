import Joi from 'joi';

export const validateRegisterSchema = Joi.object({
  username: Joi.string()
    .min(4)
    .max(20)
    .messages({
      'string.empty': 'Display name cannot be empty',
      'string.min': 'Min 6 characters',
    })
    .required(),
  email: Joi.string().email().required().messages({
    'string.empty': 'Display mail cannot be empty',
    'string.any': 'Invalid Email',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password required',
  }),
});
