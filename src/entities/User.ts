import bcrypt from "bcrypt";
import { BeforeInsert, Column, Entity, Index } from "typeorm";
import { Model } from "./utils/Model";

export enum RoleEnum {
  USER = "User",
  ADMIN = "Admin"
}

@Entity("users")
export class User extends Model {

  @Column()
  name: string;

  @Index("email_index")
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: RoleEnum,
    default: RoleEnum.USER
  })
  role: RoleEnum.USER;

  toJson() {
    return { ...this, password: undefined }
  }
  
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12)
  }

  static async comparePassword (candidatePassword: string, hashedPassword: string) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

