import { AppDataSource } from "../database/data-source.js";
import type { UserDTO } from "../dto/userDto.js";
import { User } from "../entities/User.js";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async create(userDto: UserDTO): Promise<User> {
    const user = this.userRepository.create(userDto);
    return await this.userRepository.save(user);
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
}
