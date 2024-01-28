import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Model } from "./utils/Model";
import { User } from "./User";

@Entity("tokens")
export class Token extends Model {

  @Column()
  refreshToken: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}