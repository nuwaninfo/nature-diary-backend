import express from "express";
import { createObservation } from "../controllers/observationController.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

router.post("/observations", validateToken, createObservation);

export default router;
