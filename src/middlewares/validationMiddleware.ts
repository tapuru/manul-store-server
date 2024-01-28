import { AnyZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export const validationMiddleware = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          params: req.params,
          query: req.query,
          body: req.body
        });

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            status: "fail",
            message: "Ошибка при валидации, проверте правильность заполнения полей",
            errors: error.errors
          })
        }
        next(error);
      } 
    }
}