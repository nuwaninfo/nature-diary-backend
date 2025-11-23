import { Router } from "express";
import { logIn, refreshToken } from "../controllers/authController.js";
import { createUser } from "../controllers/userController.js";

const router = Router();

router.post("/auth/login", logIn);
router.post("/auth/signup", createUser);
router.post("/auth/refresh", refreshToken);

export default router;
