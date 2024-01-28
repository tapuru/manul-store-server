import { AppDataSource } from "../db";
import { Category } from "../entities/Category";
import { AppError } from "../exeptions/AppError";

const categoryRepository = AppDataSource.getRepository(Category);

export class CategoryService {

  static async create(name:string, parentCategoryId: number | undefined, icon: string | undefined) {

    if (!parentCategoryId) {
      const category = categoryRepository.create({
        name,
        icon
      });
      await categoryRepository.save(category);
      return category;
    }

    const parentCategory = await categoryRepository.findOneBy({ id: parentCategoryId });
    if (!parentCategory) {
      throw AppError.badRequest("Несуществующая родительская категория");
    }

    const category = categoryRepository.create({
      name,
      icon,
      parentCategory: parentCategory
    });
    await categoryRepository.save(category);
    return category;
  }

  static async findAll(parentCategoryId: number | undefined) {
    let categories: [Category[], number];

    if (parentCategoryId) {
      categories = await categoryRepository.findAndCount({ where: { parentCategory: { id: parentCategoryId } }, relations: {subCategories: true, parentCategory: true} });
    } else {
      categories = await categoryRepository.findAndCount({ relations: {subCategories: true, parentCategory: true} });
    }

    return {
      data: categories[0],
      totalCount: categories[1]
    };
  }

  static async findOneByName (name: string) {
    const category = await categoryRepository.findOne(
      {
        where: { name }, 
        relations: { subCategories: { subCategories: true }, brands: true } 
      }
    );

    return category;
  }
}