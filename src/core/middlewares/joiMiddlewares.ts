import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

type RequestLocation = 'body' | 'query' | 'params';

const validate = (schema: Joi.Schema, location: RequestLocation = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await schema.validateAsync(req[location], {
        abortEarly: false,
        stripUnknown: true,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      Object.assign(req[location] as any, value);
      return next();
    } catch (error: any) {
      if (error?.isJoi) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.details.map((detail: any) => ({
            path: detail.path.join('.'),
            message: detail.message,
          })),
        });
      }

      return res.status(400).json({
        message: 'Validation failed',
        errors: [{ message: error?.message || 'Invalid request' }],
      });
    }
  };
};

export default validate;
