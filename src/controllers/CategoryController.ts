import express from "express";
import { CategoryService } from "../services/CategoryService";
import { AppError } from "../exeptions/AppError";

export class CategoryController {
  async create(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { name, parentCategoryId } = req.body;
      const icon = req.file;

      const category = await CategoryService.create(name, parseInt(parentCategoryId), icon?.filename);

      return res.json(category);
    } catch (e) {

      console.log(e);
      return next(e)
    }
  }

  async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {

    try {
      const { parentCategoryId } = req.query;

      const categories = await CategoryService.findAll(parseInt(parentCategoryId as string));

      return res.json(categories);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async getOne(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { name } = req.params;
      const category = await CategoryService.findOneByName(name);
      return res.json(category);

    } catch (error) {
      return next(AppError.badRequest(error.message));
    }
  }
}