import { Router } from "express";
import { productRouter } from "./productRouter";
import { authRouter } from "./authRouter";
import { categoryRouter } from "./categoryRouter";
import { brandRouter } from "./brandRouter";

export const appRouter = Router();

appRouter.use("/product", productRouter);
appRouter.use("/auth", authRouter);
appRouter.use("/category", categoryRouter);
appRouter.use("/brand", brandRouter);