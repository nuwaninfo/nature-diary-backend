import {
  IsBoolean,
  IsString,
  IsDateString,
  IsOptional,
  Length,
} from "class-validator";
import { Type } from "class-transformer";
import { LocationDTO } from "../dto/locationDTO.js";
import { ImageDTO } from "../dto/imageDTO.js";

export class ObservationDTO {
  @IsBoolean()
  isDomestic!: boolean;

  @IsBoolean()
  needToShare!: boolean;

  @IsBoolean()
  needIdentification!: boolean;

  @IsString()
  @Length(5, 500)
  description!: string;

  @IsDateString()
  dateOfObservation!: string;

  @IsString()
  category!: string;

  @IsOptional()
  @Type(() => LocationDTO)
  location?: LocationDTO;

  @IsOptional()
  @Type(() => ImageDTO)
  images?: ImageDTO[];
}
