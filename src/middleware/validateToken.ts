import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { CustomRequest } from "../types/types.js";

export const validateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.header("authorization")?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Access denied, missing token" });

  try {
    const verified: JwtPayload = jwt.verify(
      token,
      process.env.SECRET as string
    ) as JwtPayload;
    req.user = verified;
    next();
  } catch (error: any) {
    res.status(400).json({ message: "Access denied, invalid token" });
  }
};
