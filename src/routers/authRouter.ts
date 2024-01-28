import { Router } from "express";

import { validationMiddleware } from "../middlewares/validationMiddleware";
import { AuthController } from "../controllers/AuthController";
import { createUserSchema, loginUserSchema } from "../schemas/userSchema";
import { authMiddleware } from "../middlewares/authMiddleware";

export const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  validationMiddleware(createUserSchema),
  authController.register
);

authRouter.post(
  "/login",
  validationMiddleware(loginUserSchema),
  authController.login
)

authRouter.get(
  "/logout",
  authMiddleware,
  authController.logout
);

authRouter.get(
  "/refresh",
  authController.refresh
)