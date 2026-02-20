import type { JwtHeader, JwtPayload } from "jsonwebtoken";
import { AppDataSource } from "../database/data-source.js";
import type { LoginDTO } from "../dto/loginDTO.js";
import type { UserDTO } from "../dto/userDto.js";
import jwt from "jsonwebtoken";

import { User } from "../entities/User.js";
import { UserService } from "./userService.js";
import bcrypt from "bcrypt";
import type { ILoginReturn } from "../types/types.js";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userDto: UserDTO): Promise<User> {
    try {
      const user = new User();
      const userService = new UserService();
      const exists: boolean = await userService.isUserExists(userDto.email);
      if (exists) {
        throw new Error("User already exists");
      }

      // Hash the password
      const salt: string = bcrypt.genSaltSync(10);
      const hash: string = bcrypt.hashSync(userDto.password, salt);

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

  async logIn(loginDto: LoginDTO): Promise<ILoginReturn> {
    const { email, password } = loginDto;

    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      return {
        accessToken: "",
        email: "",
        firstName: "",
        status: 401,
        msg: "User does not exists. Please sign up",
      };
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        accessToken: "",
        email: "",
        firstName: "",
        status: 401,
        msg: "Invalid credentials",
      };
    }

    const JwtPayload: JwtPayload = {
      id: user.id,
      role: user.role,
    };

    const secret: string | undefined = process.env.SECRET;

    if (!secret) {
      throw new Error("JWT SECRET is not defined in environment variables");
    }

    const accessToken = jwt.sign(JwtPayload, process.env.SECRET!, {
      expiresIn: "20m",
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_SECRET!,
      { expiresIn: "7d" }, // 7d
    );

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      email: user.email,
      firstName: user.firstName,
      status: 200,
      msg: "Login success",
    };
  }

  async verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as any;

      // Fetch user from DB
      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user || user.refreshToken !== token) {
        throw new Error("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.SECRET!,
        { expiresIn: "5m" },
      );

      return { newAccessToken, user };
    } catch (err) {
      throw new Error("Invalid or expired refresh token");
    }
  }
}
