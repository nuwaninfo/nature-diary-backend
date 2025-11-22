import type { Request, Response } from "express";
import { SuggestionService } from "../services/suggestionService.js";
import type { CustomRequest } from "../types/types.js"; 

const suggestionService = new SuggestionService();

export const createSuggestion = async (req: CustomRequest, res: Response) => {
  try {
    console.log("Content-Type Header:", req.headers["content-type"]);
    console.log("Raw Body:", req.body);
    const observationId = parseInt(req.params.id || "");
    if (isNaN(observationId)) {
      return res.status(400).json({ message: "Invalid observation ID" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { suggested_name } = req.body;
    if (!suggested_name) {
      return res.status(400).json({ message: "Suggestion text is required" });
    }

    const cleanedName = suggested_name.trim();
    const newSuggestion = await suggestionService.addSuggestion(
      userId,
      observationId,
      cleanedName
    );

    return res.status(201).json(newSuggestion);

  } catch (error: any) {
    console.error("Error creating suggestion:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const acceptSuggestion = async (req: CustomRequest, res: Response) => {
  try {
    const suggestionId = parseInt(req.params.suggestionId || "");
    const userId = req.user?.id;

    if (isNaN(suggestionId) || !userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const updatedObservation = await suggestionService.acceptSuggestion(userId, suggestionId);

    return res.status(200).json({
      message: "Suggestion accepted!",
      observation: updatedObservation
    });

  } catch (error: any) {
    console.error("Error accepting suggestion:", error);
    const status = error.message.includes("Unauthorized") ? 403 : 500;
    return res.status(status).json({ message: error.message });
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  try {
      const observationId = parseInt(req.params.id || "");
      if (isNaN(observationId)) return res.status(400).json({ message: "Invalid ID" });

      const suggestions = await suggestionService.getSuggestionsByObservation(observationId);
      res.status(200).json(suggestions);
  } catch (error: any) {
      console.error("Error getting suggestions:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};