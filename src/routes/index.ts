import { Router } from "express";
import userRouter from "./userRoutes.js";
import authRouter from "./authRoutes.js";

const rootRouter = Router();

rootRouter.use(userRouter);
rootRouter.use(authRouter);

export default rootRouter;
