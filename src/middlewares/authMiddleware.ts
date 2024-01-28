import { AppError } from "../exeptions/AppError";
import express from "express";
import { verifyJwt } from "../utils/jwt";

export const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      return next(AppError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(AppError.UnauthorizedError());
    }

    const decoded = verifyJwt(accessToken, "access");
    if (!decoded) {
      return next(AppError.UnauthorizedError());
    }

    res.locals.user = decoded;

    next();
  } catch (error) {
    return next(AppError.UnauthorizedError());
  }
}