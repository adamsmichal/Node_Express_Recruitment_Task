import { ApiError } from "../errors";
import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      next(ApiError.badRequest(error));
      return;
    }

    req.body = value;
    next();
  };
};
