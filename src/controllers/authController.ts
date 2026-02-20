import type { Request, Response } from "express";
import { AuthService } from "../services/authService.js";
import { LoginDTO } from "../dto/loginDTO.js";
import { UserService } from "../services/userService.js";
import type { UserDTO } from "../dto/userDto.js";
import jwt from "jsonwebtoken";
import { User } from "../entities/User.js";

const authService = new AuthService();

// Login
export const logIn = async (req: Request, res: Response) => {
  try {
    const loginDto: LoginDTO = req.body;

    const result = await authService.logIn(loginDto);

    return res.json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message || "Unauthorized" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ msg: "Refresh token missing" });

  try {
    const { newAccessToken } =
      await authService.verifyRefreshToken(refreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (err: any) {
    res.status(403).json({ msg: err.message });
  }
};
