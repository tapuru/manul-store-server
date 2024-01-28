import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { Model } from "./utils/Model";
import { Product } from "./Product";
import { Category } from "./Category";

@Entity("brand")
export class Brand extends Model{

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @ManyToOne(
    () => Product,
    product => product.brand,
    {onDelete: "CASCADE"}
  )
  products: Product[]

  @ManyToMany(
    () => Category,
    { onDelete: "CASCADE" }
  )
  categories: Category[]
}