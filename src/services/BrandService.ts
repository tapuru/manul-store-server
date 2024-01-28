import { Category } from "../entities/Category";
import { AppDataSource } from "../db";
import { Brand } from "../entities/Brand";
import { AppError } from "../exeptions/AppError";
import { FindManyOptions } from "typeorm";

const brandRepository = AppDataSource.getRepository(Brand);
const categoryRepository = AppDataSource.getRepository(Category)

export class BrandService {
  static async create(name: string, icon: string | undefined) {
    const brand = brandRepository.create({
      name,
      icon
    });
    await brandRepository.save(brand);
    return brand;
  }

  static async findAll(categoryName: string | undefined) {

    const category = await categoryRepository.findOne({ where: { name: categoryName }, relations: { brands: true } });
    if (!category) {
      throw AppError.badRequest("Несуществующая категория");
    }

    const brands = category.brands

    // let findOptions: FindManyOptions<Brand>;

    // if (categoryName) {
    //   findOptions = {
    //     where: {
    //       categories: [{ name: categoryName }]
    //     },
    //   }
    // } else {
    //   findOptions = {}
    // }

    // console.log(findOptions)

    // const brands = await brandRepository.findAndCount(findOptions);
    // console.log(brands)
    return {
      data: brands,
    }
  }

  static async addCategory(categoryId: number, brandId: number) {
    const category = await categoryRepository.findOne({where: {id: categoryId}, relations: {brands: true}});
    const brand = await brandRepository.findOne({where: {id: brandId}, relations: {categories: true}});

    if (!category || !brand) {
      throw AppError.badRequest("несуществующая категория или бренд");
    }

    if (!category.brands) {
      category.brands = [brand];
    } else {
      if (!category.brands.includes(brand)) {
        category.brands.push(brand);
      }
    }

    await categoryRepository.save(category);
    await brandRepository.save(brand);

    return "Категория присвоена бренду";
  }
}