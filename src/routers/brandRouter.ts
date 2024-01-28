import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { BrandController } from "../controllers/BrandController";
import { Router } from "express";

export const brandRouter = Router();
const brandController = new BrandController();

brandRouter.post("/", uploadMiddleware.single("icon"), brandController.create);
brandRouter.get("/", brandController.getAll);