import express from "express";
import {
  createObservation,
  getObservation,
} from "../controllers/observationController.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

router.post("/observations", validateToken, createObservation);
router.get("/public/observations/:id", getObservation);

export default router;
