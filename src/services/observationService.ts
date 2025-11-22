import { AppDataSource } from "../database/data-source.js";
import { Observation } from "../entities/Observation.js";
import { Image } from "../entities/Image.js";
import { Location } from "../entities/Location.js";
import { User } from "../entities/User.js";
import { ObservationDTO } from "../dto/observationDTO.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { CategoryType } from "../types/types.js";
import fs from "fs";
import path from "path";

export class ObservationService {
  private observationRepository = AppDataSource.getRepository(Observation);
  private imageRepository = AppDataSource.getRepository(Image);
  private locationRepository = AppDataSource.getRepository(Location);
  private userRepository = AppDataSource.getRepository(User);

  // Utility: rename file and move to upload folder
  private saveUploadedImages(
    files: Express.Multer.File[],
    userId: number
  ): string[] {
    if (!files || files.length === 0) return [];

    return files.map((file) => {
      const ext = path.extname(file.originalname);
      const newName = `obs-${userId}-${Date.now()}-${Math.round(
        Math.random() * 9999
      )}${ext}`;

      const uploadDir = path.join(process.cwd(), "images");

      const destination = path.join(uploadDir, newName);

      fs.renameSync(file.path, destination);

      return newName;
    });
  }

  private deleteImageFiles(images: Image[]) {
    for (const img of images) {
      const filePath = path.join("/images/", img.imageName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  // Create a new observation
  async createObservation(
    userId: number,
    dto: ObservationDTO,
    files: Express.Multer.File[]
  ): Promise<Observation> {
    const instance = plainToInstance(ObservationDTO, dto);
    const errors = await validate(instance);

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const observation = new Observation();
    observation.discovery = dto.discovery;
    observation.scientific_name = dto.scientific_name;
    observation.common_name = dto.common_name;
    observation.public = dto.public;
    observation.identified = dto.identified;
    observation.description = dto.description;
    observation.date = new Date(dto.date);
    observation.category = dto.category;
    observation.user = user;

    if (dto.location) {
      const location = new Location();
      location.lat = dto.location.lat;
      location.lng = dto.location.lng;
      observation.location = location;
    }

    const savedNames = this.saveUploadedImages(files, userId);

    observation.images = savedNames.map((name) => {
      const img = new Image();
      img.imageName = name;
      img.observation = observation;
      return img;
    });

    return await this.observationRepository.save(observation);
  }

  // Retrieve an observation by ID
  async getObservationById(id: number): Promise<Observation | null> {
    return await this.observationRepository.findOne({
      where: { id },
      relations: ["images", "user", "location"],
    });
  }

  // Retrieve all observations with optional filters and pagination
  async getAllObservations(filters?: {
    category?: CategoryType;
    identified?: boolean;
    public?: boolean;
    userId?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    observations: Observation[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    console.log("Filters received in getAllObservations:", filters);
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.observationRepository
      .createQueryBuilder("observation")
      .leftJoinAndSelect("observation.user", "user")
      .leftJoinAndSelect("observation.images", "images")
      .leftJoinAndSelect("observation.location", "location");

    if (filters?.category) {
      queryBuilder.andWhere("observation.category = :category", {
        category: filters.category,
      });
    }

    if (filters?.identified !== undefined) {
      queryBuilder.andWhere("observation.identified  = :identified", {
        identified: filters.identified,
      });
    }

    if (filters?.public !== undefined) {
      queryBuilder.andWhere("observation.public = :public", {
        public: filters.public,
      });
    }

    if (filters?.userId) {
      queryBuilder.andWhere("observation.user.id = :userId", {
        userId: filters.userId,
      });
    }

    try {
      const [observations, total] = await queryBuilder
        .orderBy("observation.date", "DESC")
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        observations,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (err) {
      console.error("ERROR in getAllObservations:", err);
      throw err;
    }
  }

  // Update an existing observation
  async updateObservation(
    id: number,
    userId: number,
    updateData: Partial<ObservationDTO>,
    files: Express.Multer.File[]
  ): Promise<Observation> {
    const observation = await this.observationRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["images", "user", "location"],
    });

    if (!observation) {
      throw new Error(`Observation with id ${id} not found or access denied`);
    }

    if (Object.keys(updateData).length > 0) {
      const instance = plainToInstance(ObservationDTO, updateData);
      const errors = await validate(instance, { skipMissingProperties: true });

      if (errors.length > 0) {
        throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
      }
    }

    if (updateData.discovery !== undefined) {
      observation.discovery = updateData.discovery;
    }
    if (updateData.scientific_name !== undefined) {
      observation.scientific_name = updateData.scientific_name;
    }
    if (updateData.common_name !== undefined) {
      observation.common_name = updateData.common_name;
    }
    if (updateData.public !== undefined) {
      observation.public = updateData.public;
    }
    if (updateData.identified !== undefined) {
      observation.identified = updateData.identified;
    }
    if (updateData.description) {
      observation.description = updateData.description;
    }
    if (updateData.date) {
      observation.date = new Date(updateData.date);
    }
    if (updateData.category) {
      observation.category = updateData.category;
    }

    if (updateData.location) {
      if (observation.location) {
        observation.location.lat = updateData.location.lat;
        observation.location.lng = updateData.location.lng;
      } else {
        const newLocation = new Location();
        newLocation.lat = updateData.location.lat;
        newLocation.lng = updateData.location.lng;
        observation.location = newLocation;
      }
    }

    if (files && files.length > 0) {
      if (observation.images.length > 0) {
        this.deleteImageFiles(observation.images);
        await this.imageRepository.remove(observation.images);
      }

      const savedNames = this.saveUploadedImages(files, userId);

      observation.images = savedNames.map((name) => {
        const img = new Image();
        img.imageName = name;
        img.observation = observation;
        return img;
      });
    }

    return await this.observationRepository.save(observation);
  }

  // Delete an observation
  async deleteObservation(id: number, userId: number): Promise<boolean> {
    const observation = await this.observationRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!observation) {
      throw new Error(`Observation with id ${id} not found or access denied`);
    }

    this.deleteImageFiles(observation.images);

    await this.observationRepository.remove(observation);

    return true;
  }
}
