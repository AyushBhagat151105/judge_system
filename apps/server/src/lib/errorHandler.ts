import type { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError";
import logger from "./logger";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let { statusCode, message, errors } = err;

  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || "Internal Server Error";
    errors = err.errors || [];
  }

  logger.error(`[ErrorHandler] Error: ${message}`, {
    statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack,
    errors
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};
export default globalErrorHandler;
