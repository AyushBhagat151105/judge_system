import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";
import ApiError from "./ApiError";

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const issues = error.issues || error.errors || [];
      const errors = issues.map((err: any) => ({
        field: err.path.slice(1).join("."),
        message: err.message,
      }));
      next(new ApiError(400, "Validation failed", errors));
    }
  };
};
export default validate;
