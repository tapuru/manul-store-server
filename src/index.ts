import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AppDataSource } from "./db";
import { appRouter } from "./routers";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
// import { Category } from "./entities/Category";
// import { Brand } from "./entities/Brand";
config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(express.static("./static"));
app.use("/api", appRouter);

app.use(errorHandlingMiddleware);


const main = async () => {
  try {

    await AppDataSource.initialize();

    // await Category.create({
    //   name: "qwerty12"
    // }).save();
    // await Brand.create({
    //   name: "qwerty"
    // }).save();

    // const category = await Category.findOneBy({id: 1});
    // await SubCategory.create({
    //   name: "qwerty",
    //   parentCategory: category as Category
    // }).save();

    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    
  } catch (e) {
    console.log(e);
  }
}

main();