import type { Request, Response } from "express";
import { AuthService } from "../services/authService.js";
import { LoginDTO } from "../dto/loginDTO.js";

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
