import type { Request, Response } from "express";
import { ObservationService } from "../services/observationService.js";
import type { ObservationDTO } from "../dto/observationDTO.js";
import type { CustomRequest } from "../types/types.js";

const observationService = new ObservationService();

export const createObservation = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const observationDto: ObservationDTO = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const observation = await observationService.createObservation(
      userId,
      observationDto
    );
    res.status(201).json({
      success: true,
      message: "Observation created successfully",
      observationId: observation.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: String(error) });
    }
  }
};

export const getObservation = async (req: CustomRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ message: "Invalid observation ID" });

    const observation = await observationService.getObservationById(id);
    if (!observation)
      return res.status(404).json({ message: "Observation not found" });

    res.status(200).json({
      success: true,
      observation,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: String(error) });
    }
  }
};
