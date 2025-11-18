import express from "express";
import {
  createObservation,
  getObservation,
  getAllObservations,
  getUserObservations,
  updateObservation,
  deleteObservation,
} from "../controllers/observationController.js";
import { validateToken } from "../middleware/validateToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Protected routes
// create observation
router.post(
  "/observations",
  validateToken,
  upload.array("images", 10),
  createObservation
);
// get user observations
router.get("/observations", validateToken, getUserObservations);
// update observation
router.put("/observations/:id", validateToken, updateObservation);
// delete observation
router.delete("/observations/:id", validateToken, deleteObservation);

// Public routes
router.get("/public/observations/:id", getObservation);
router.get("/public/observations", getAllObservations);

export default router;
