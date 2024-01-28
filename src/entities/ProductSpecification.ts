import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { Model } from "./utils/Model";

@Entity("product_specification")
export class ProductSpecification extends Model {

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(
    () => Product,
    product => product.specifications,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "product_id" })
  product: Product
}