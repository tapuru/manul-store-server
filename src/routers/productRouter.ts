import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { ProductController } from "../controllers/ProductController";
import { Router } from "express";

export const productRouter = Router();
const productController = new ProductController

productRouter.get("/", productController.getAll);
productRouter.get("/:id", productController.getOne);
productRouter.post(
  "/", 
  uploadMiddleware.fields([{ name: 'previewImage', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), 
  productController.create
);


