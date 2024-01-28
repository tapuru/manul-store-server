import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { Model } from "./utils/Model";

@Entity("product_gallery")
export class ProductGallery extends Model{

  @Column()
  url: string;

  @ManyToOne(
    () => Product,
    product => product.gallery,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "product_id" })
  product: Product;
}