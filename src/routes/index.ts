import { Router } from "express";
import userRouter from "./userRoutes.js";

const rootRouter = Router();

rootRouter.use(userRouter);

export default rootRouter;
