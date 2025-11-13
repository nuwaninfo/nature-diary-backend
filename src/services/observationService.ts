import { AppDataSource } from "../database/data-source.js";
import { Observation } from "../entities/Observation.js";
import { Image } from "../entities/Image.js";
import { Location } from "../entities/Location.js";
import { User } from "../entities/User.js";
import { ObservationDTO } from "../dto/observationDTO.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

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
}
