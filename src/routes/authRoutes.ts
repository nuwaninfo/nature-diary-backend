import { Router } from "express";
import { logIn } from "../controllers/authController.js";
import { createUser } from "../controllers/userController.js";

const router = Router();

router.post("/auth/login", logIn);
router.post("/auth/signup", createUser);

export default router;
