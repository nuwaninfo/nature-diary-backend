import type { Request, Response } from "express";
import { ObservationService } from "../services/observationService.js";

import type { CustomRequest } from "../types/types.js";
import { plainToInstance } from "class-transformer";
import { ObservationDTO } from "../dto/observationDTO.js";

const observationService = new ObservationService();

// Create a new observation for the authenticated user
export const createObservation = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const files = req.files as Express.Multer.File[];

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    //const observationDto: ObservationDTO = JSON.parse(req.body.data);
    const bodyData = JSON.parse(req.body.data);

    // Move lat/lng into location object if they exist
    if (bodyData.lat !== undefined && bodyData.lng !== undefined) {
      bodyData.location = {
        lat: bodyData.lat,
        lng: bodyData.lng,
      };
    }

    const observationDto: ObservationDTO = plainToInstance(
      ObservationDTO,
      bodyData
    );

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const observation = await observationService.createObservation(
      userId,
      observationDto,
      files
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

// Get a single observation by ID for public access
export const getObservation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ message: "Invalid observation ID" });

    const observation = await observationService.getObservationById(id);
    //console.log("Retrieved observation:", observation);

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

// Get all observations with optional filters and pagination for public access
export const getAllObservations = async (req: Request, res: Response) => {
  try {
    console.log("Query parameters received:", req.query);
    const { category, identified, needToShare, userId, page, limit } =
      req.query;

    console.log("######", identified);

    const filters = {
      ...(category && {
        category: category as "fauna" | "flora" | "funga",
      }),
      ...(identified !== undefined && {
        identified: identified === "true",
      }),
      ...(needToShare !== undefined && {
        needToShare: needToShare === "true",
      }),
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

// Get observations for the authenticated user with optional filters and pagination
export const getUserObservations = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Extract optional query parameters for filtering/pagination
    const { category, needIdentification, needToShare, page, limit } =
      req.query;

    const filters = {
      ...(category && { category: category as "fauna" | "flora" | "funga" }),
      ...(needIdentification !== undefined && {
        needIdentification: needIdentification === "true",
      }),
      ...(needToShare !== undefined && {
        needToShare: needToShare === "true",
      }),
      userId: userId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };

    const result = await observationService.getAllObservations(filters);

    res.status(200).json({
      success: true,
      data: result.observations,
      pagination: {
        page: result.page,
        limit: filters.limit,
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

// Update an existing observation for the authenticated user
export const updateObservation = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const files = req.files as Express.Multer.File[];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid observation ID",
      });
    }

    const updateData: Partial<ObservationDTO> = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    const updatedObservation = await observationService.updateObservation(
      id,
      userId,
      updateData,
      files
    );

    res.status(200).json({
      success: true,
      message: "Observation updated successfully",
      data: updatedObservation,
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

// Delete an observation for the authenticated user
export const deleteObservation = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid observation ID",
      });
    }

    await observationService.deleteObservation(id, userId);

    res.status(200).json({
      success: true,
      message: "Observation deleted successfully",
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
