import {
  IsBoolean,
  IsString,
  IsDateString,
  IsOptional,
  Length,
  isString,
} from "class-validator";
import { Type } from "class-transformer";
import { LocationDTO } from "../dto/locationDTO.js";
import { ImageDTO } from "../dto/imageDTO.js";

export type CategoryType = "fauna" | "flora" | "funga";

export class ObservationDTO {
  @IsString()
  discovery!: string;

  @IsString()
  scientific_name!: string;

  @IsString()
  common_name!: string;

  @IsBoolean()
  public!: boolean;

  @IsBoolean()
  identified!: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description!: string;

  @IsDateString()
  date!: string;

  @IsString()
  category!: CategoryType;

  @IsOptional()
  @Type(() => LocationDTO)
  location?: LocationDTO;
}
