import express from "express";
import {
  createObservation,
  getObservation,
  getAllObservations,
  getUserObservations,
  updateObservation,
} from "../controllers/observationController.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

// Protected routes
// create observation
router.post("/observations", validateToken, createObservation);
// get user observations
router.get("/observations", validateToken, getUserObservations);
// update observation
router.put("/observations/:id", validateToken, updateObservation);

// Public routes
router.get("/public/observations/:id", getObservation);
router.get("/public/observations", getAllObservations);

export default router;
