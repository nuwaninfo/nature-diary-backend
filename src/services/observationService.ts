import { AppDataSource } from "../database/data-source.js";
import { Observation } from "../entities/Observation.js";
import { Image } from "../entities/Image.js";
import { Location } from "../entities/Location.js";
import { User } from "../entities/User.js";
import { ObservationDTO } from "../dto/observationDTO.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { CategoryType } from "../types/types.js";

export class ObservationService {
  private observationRepository = AppDataSource.getRepository(Observation);
  private imageRepository = AppDataSource.getRepository(Image);
  private locationRepository = AppDataSource.getRepository(Location);
  private userRepository = AppDataSource.getRepository(User);

  // Create a new observation
  async createObservation(
    userId: number,
    dto: ObservationDTO
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
    observation.isDomestic = dto.isDomestic;
    observation.needToShare = dto.needToShare;
    observation.needIdentification = dto.needIdentification;
    observation.description = dto.description;
    observation.dateOfObservation = new Date(dto.dateOfObservation);
    observation.category = dto.category;
    observation.user = user;

    if (dto.location) {
      const location = new Location();
      location.latitude = dto.location.latitude;
      location.longitude = dto.location.longitude;
      observation.location = location;
    }

    if (dto.images && dto.images.length > 0) {
      const images = dto.images.map((imgDTO) => {
        const image = new Image();
        image.imageName = imgDTO.imageName;
        image.observation = observation;
        return image;
      });
      observation.images = images;
    }

    return await this.observationRepository.save(observation);
  }

  // Retrieve an observation by ID
  async getObservationById(id: number): Promise<Observation | null> {
    return await this.observationRepository.findOne({
      where: { id },
      relations: ["user", "images", "location"],
    });
  }

  // Retrieve all observations with optional filters and pagination
  async getAllObservations(filters?: {
    category?: CategoryType;
    needIdentification?: boolean;
    needToShare?: boolean;
    userId?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    observations: Observation[];
    total: number;
    page: number;
    totalPages: number;
  }> {
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

    if (filters?.needIdentification !== undefined) {
      queryBuilder.andWhere(
        "observation.needIdentification = :needIdentification",
        {
          needIdentification: filters.needIdentification,
        }
      );
    }

    if (filters?.needToShare !== undefined) {
      queryBuilder.andWhere("observation.needToShare = :needToShare", {
        needToShare: filters.needToShare,
      });
    }

    if (filters?.userId) {
      queryBuilder.andWhere("observation.user.id = :userId", {
        userId: filters.userId,
      });
    }

    const [observations, total] = await queryBuilder
      .orderBy("observation.dateOfObservation", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      observations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
