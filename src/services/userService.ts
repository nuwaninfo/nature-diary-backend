import { AppDataSource } from "../database/data-source.js";
import type { UserDTO } from "../dto/userDto.js";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async create(userDto: UserDTO): Promise<User> {
    //console.log(userDto);
    try {
      const exists: boolean = await this.isUserExists(userDto.email);
      if (exists) {
        throw new Error("User already exists");
      }

      // Hash the password
      const salt: string = bcrypt.genSaltSync(10);
      const hash: string = bcrypt.hashSync(userDto.password, salt);

      const user = new User();
      user.firstName = userDto.firstName;
      user.lastName = userDto.lastName;
      user.email = userDto.email;
      user.role = "observer";
      user.password = hash;

      return await this.userRepository.save(user);
    } catch (error: any) {
      throw error;
    }
  }

  async getById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(id: number, userDto: UserDTO): Promise<User | null> {
    const user = await this.getById(id);
    if (!user) return null;
    Object.assign(user, userDto);
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async isUserExists(email: string): Promise<boolean> {
    try {
      const existing: User | null = await this.userRepository.findOneBy({
        email,
      });
      return !!existing;
    } catch {
      return false;
    }
  }
}
