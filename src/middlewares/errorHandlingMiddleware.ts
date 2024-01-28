import { AppError } from "../exeptions/AppError";
import express from "express";

export const errorHandlingMiddleware = (error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка" });
}