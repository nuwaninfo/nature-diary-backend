import { Router } from "express";
import { logIn } from "../controllers/authController.js";

const router = Router();

router.post("/auth/login", logIn);

export default router;
