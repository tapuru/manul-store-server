import { AppError } from "../exeptions/AppError";
import express from "express";
import { BrandService } from "../services/BrandService";

export class BrandController {

  async create(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { name } = req.body;
      const icon = req.file;

      const brand = await BrandService.create(name, icon?.filename);

      return res.json(brand);
    } catch (error) {
      next(AppError.badRequest(error.message));
    }
  }

  async getAll(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { categoryName } = req.query;

      const brands = await BrandService.findAll(categoryName as string);

      return res.json(brands);
    } catch (error) {
      next(AppError.badRequest(error.message));
    }
  }
}