import { config } from "dotenv";
import { Product } from "./entities/Product";
import { DataSource } from "typeorm";
import { Category } from "./entities/Category";
import { Brand } from "./entities/Brand";
import { ProductGallery } from "./entities/ProductGallery";
import { ProductSpecification } from "./entities/ProductSpecification";
import { User } from "./entities/User";
import { Token } from "./entities/Token";
config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME, 
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [
    Product, 
    Category, 
    Brand, 
    ProductGallery, 
    ProductSpecification,
    User,
    Token
  ],
  synchronize: true
});