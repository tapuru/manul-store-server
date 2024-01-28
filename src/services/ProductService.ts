import { ProductGallery } from "../entities/ProductGallery";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";
import { Brand } from "../entities/Brand";
import { FindManyOptions } from "typeorm";
import { AppError } from "../exeptions/AppError";
import { AppDataSource } from "../db";

const productRepository = AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository(Category);
const brandRepository = AppDataSource.getRepository(Brand);

export class ProductService {

  //по хз какой причине не работает если указать тип стринг
  static async createProduct(
    name: any,
    price: any,
    brandId: any,
    categoryIds: any[],
    description: any,
    quantityInStock: any,
    previewImage: any
  ) {

    const categories: Category[] = [];

    categoryIds.forEach(async (id) => {
      const wantedCategory = await categoryRepository.findOneBy({ id });
      if (!wantedCategory) throw AppError.badRequest("Невалидная категория");
      categories.push(wantedCategory);
    })
    const wantedBrand = await Brand.findOneBy({ id: Number(brandId) });

    if (!wantedBrand ) {
      throw AppError.badRequest("Невалидная категория,  или бренд")
    }

    const product = productRepository.create({
      name,
      price,
      description,
      quantityInStock,
      brand: wantedBrand,
      categories,
      previewImage: previewImage.filename
    });
    await product.save();

    return product;
  }

  static async createProductGallery(
    gallery: Express.Multer.File[],
    product: Product
  ) {
    gallery.forEach(async (image) => {
      const imageEntity = ProductGallery.create({
        url: image.filename,
        product
      });
      await imageEntity.save();
    });
  }

  static async findProducts(
    brandName?: string, 
    categoryName?: string,
    limit?: string, 
    page?: string
  ) {
    let offset: number;
    let skip: number;

    if (limit) {
      offset = parseInt(limit);

    } else {
      offset = 10;
    }

    if (page) {
      skip = parseInt(page) === 1 ? 0 : (parseInt(page) - 1) * offset;
    } else {
      skip = 0;
    }

    let findOptions: FindManyOptions<Product>;

    if (categoryName) {
      findOptions = {
        take: offset,
        skip,
        relations: { gallery: true, specifications: true },
        where: { brand: { name: brandName }, categories: [{ name: categoryName }] }
      }
    } else {
      findOptions = {
        take: offset,
        skip,
        relations: { gallery: true, specifications: true },
        where: { brand: { name: brandName } }
      }
    }

    const res =  await Product.findAndCount(findOptions);
    return { data: res[0], totalCount:res[1] }
  }

  static async findProductById(id: number) {

    const product = await Product.findOne({ where: { id }, relations: { gallery: true, specifications: true, categories: true } });
    if (!product) {
      throw new Error("no product with that id");
    }

    return product;
  }
}