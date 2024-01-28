import { User } from "entities/User";

export class UserDto {
  public email: string;
  public name: string;
  public id: number;
  public role: string;

  constructor (entity: User) {
    this.email = entity.email;
    this.id = entity.id;
    this.name = entity.name;
    this.role = entity.role;
  }
}