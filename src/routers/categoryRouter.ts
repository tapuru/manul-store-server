import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { CategoryController } from "../controllers/CategoryController";
import { Router } from "express";

export const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get("/", categoryController.getAll);
categoryRouter.get("/:name", categoryController.getOne);
categoryRouter.post(
  "/",
  uploadMiddleware.single("icon"),
  categoryController.create
);
