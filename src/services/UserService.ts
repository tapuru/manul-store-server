import { User } from "../entities/User";
import { CreateUserInput } from "../schemas/userSchema";
import { AppDataSource } from "../db";

const userRepository = AppDataSource.getRepository(User)

export class UserService {

  static async createUser(input: CreateUserInput) {
    const user = userRepository.create(input as User);
    await userRepository.save(user);
    return user;
  }

  static async findUserByEmail(email: string) {
    return await userRepository.findOneBy({ email });
  }

  static async findUserById(id: number) {
    return await userRepository.findOneBy({ id });
  }

  static async findUser(query: Object) {
    return await userRepository.findOneBy(query);
  }
}