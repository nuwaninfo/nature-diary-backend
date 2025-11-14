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

export const getAllObservations = async (req: CustomRequest, res: Response) => {
  try {
    const { category, needIdentification, needToShare, userId, page, limit } =
      req.query;

    const filters = {
      ...(category && {
        category: category as "fauna" | "flora" | "funga",
      }),
      ...(needIdentification !== undefined && {
        needIdentification: needIdentification === "true",
      }),
      ...(needToShare !== undefined && {
        needToShare: needToShare === "true",
      }),
      ...(userId && { userId: Number(userId) }),
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };

    const result = await observationService.getAllObservations(filters);

    const currentLimit = filters.limit || 10;

    res.status(200).json({
      success: true,
      data: result.observations,
      pagination: {
        page: result.page,
        limit: currentLimit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: String(error),
      });
    }
  }
};
