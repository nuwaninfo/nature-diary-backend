import { IsString } from "class-validator";

export class ImageDTO {
  @IsString()
  imageName!: string;
}
