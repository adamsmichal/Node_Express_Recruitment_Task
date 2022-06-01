import { ValidationError } from "joi";

export class ApiError {
  message: string | ValidationError;
  code: number;

  constructor(code: number, message: string | ValidationError) {
    this.message = message;
    this.code = code;
  }

  static noMatchingResult(msg: string) {
    return new ApiError(200, msg);
  }

  static badRequest(msg: string | ValidationError) {
    return new ApiError(400, msg);
  }

  static notFound(msg: string) {
    return new ApiError(404, msg);
  }

  static internal(msg: string) {
    return new ApiError(500, msg);
  }
}
