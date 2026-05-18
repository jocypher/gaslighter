import { NextFunction, Request, Response } from "express";
import Joi, { valid } from "joi";

type RequestLocation = "body" | "query" | "params";

const validate = (schema: Joi.Schema, location: RequestLocation = "body") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!schema) return;
    try{
         const value = await schema.validateAsync(req[location], {
           abortEarly: false,
           stripUnknown: true,
           errors: {
             wrap: {
               label: false,
             },
           },
         });
         req[location] = value

         return next()
    }catch(error:any){
         return res.status(400).json({
           message: "Validation failed",
           errors: error.details.map((detail: any) => ({
             path: detail.path.join("."),
             message: detail.message,
           })),
         });
    }
  };
};

export default validate
