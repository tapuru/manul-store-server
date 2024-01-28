import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "./utils/Model";
import { Category } from "./Category";
import { Brand } from "./Brand";
import { ProductGallery } from "./ProductGallery";
import { ProductSpecification } from "./ProductSpecification";

@Entity("product")
export class Product extends Model{

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: false })
  price:number;

  //ТуДу переделать с использованием таблицы отзывов
  @Column({ default: 0 })
  rating: number;

  @Column({ nullable: true })
  previewImage: string;

  @Column({ default: 0 })
  quantityInStock: number;

  // @ManyToOne(
  //   () => Category,
  //   category => category.products,
  //   { nullable: true }
  // )
  // @JoinTable({ name: "category_id" })
  // category: Category
  
  @ManyToMany(
    () => Category,
    {onDelete: "CASCADE"}
  )
  @JoinTable({
    name: "products_categories",
    joinColumn: {
      name: "category",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "product",
      referencedColumnName: "id"
    }
  })
  categories: Category[]

  @ManyToOne(
    () => Brand,
    brand => brand.products,
    { nullable: true, onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "brand_id" })
  brand: Brand

  @OneToMany(
    () => ProductGallery,
    gallery => gallery.product,
  )
  gallery: ProductGallery[];

  @OneToMany(
    () => ProductSpecification,
    specification => specification.product,
    { nullable: true, }
  )
  specifications: ProductSpecification[]
}
