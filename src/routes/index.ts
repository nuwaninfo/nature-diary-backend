import { Router } from "express";
import userRouter from "./userRoutes.js";
import authRouter from "./authRoutes.js";
import obsrvationRouter from "../routes/observationRoutes.js";

const rootRouter = Router();

rootRouter.use(userRouter);
rootRouter.use(authRouter);
rootRouter.use(obsrvationRouter);

export default rootRouter;
