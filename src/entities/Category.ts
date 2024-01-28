import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Model } from "./utils/Model";
import { Product } from "./Product";
import { Brand } from "./Brand";

@Entity("category")
export class Category extends Model {

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  icon: string;

  // @OneToMany(
  //   () => Product,
  //   product => product.category
  // )
  // products: Product[];

  @ManyToMany(
    () => Product,
    {onDelete: "CASCADE"}
  )
  products: Product[]

  @OneToMany(
    () => Category,
    category => category.parentCategory
  )
  subCategories: Category[];
  
  @ManyToOne(
    () => Category,
    category => category.subCategories,
    {onDelete: "CASCADE"}
  )
  parentCategory: Category;

  @ManyToMany(
    () => Brand,
    {onDelete: "CASCADE"}
  )
  @JoinTable({
    name: "brands_categories",
    joinColumn: {
      name: "category",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "brand",
      referencedColumnName: "id"
    }
  })
  brands: Brand[]
}