import { ApiError } from "./api.error";
import { Response, Request, NextFunction } from "express";

export const apiErrorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.code).json(err);
  }
  return res.status(500).json(ApiError.internal("something went wrong"));
};
