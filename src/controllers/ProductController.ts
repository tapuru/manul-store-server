import { Product } from "../entities/Product";
import express from "express";
import { ProductService } from "../services/ProductService";
import uuid from "uuid";
import { ProductGallery } from "../entities/ProductGallery";
import { Category } from "../entities/Category";
import { Brand } from "../entities/Brand";
import { AppDataSource } from "../db";
import { BrandService } from "../services/BrandService";
import { AppError } from "../exeptions/AppError";

export class ProductController {
  async create(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const {
        name,
        price,
        brandId,
        categoryIds,
        specifications,
        description,
        quantityInStock
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      const product = await ProductService.createProduct(
        name,
        price,
        brandId,
        categoryIds,
        description,
        quantityInStock,
        files.previewImage[0]
      )

      await ProductService.createProductGallery(files.gallery, product);
      // categoryIds.forEach(async (categoryId: number) => {
      //   await BrandService.addCategory(categoryId, brandId);
      // });

      return res.json(product);
    } catch (error) {
      next(AppError.badRequest(error.message));
    }
  }

  async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
      const { brandName, categoryName, page, limit } = req.query;

      const products = await ProductService.findProducts(brandName as string, categoryName as string, limit as string, page as string)
      res.json(products);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async getOne(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { id } = req.params;

      const product = await ProductService.findProductById(Number(id));

      res.json(product);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
}