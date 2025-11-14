import express from "express";
import {
  createObservation,
  getObservation,
  getAllObservations,
} from "../controllers/observationController.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

router.post("/observations", validateToken, createObservation);
router.get("/public/observations/:id", getObservation);
router.get("/public/observations", getAllObservations);

export default router;
