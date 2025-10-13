import { IsEmail, IsString, IsDate } from "class-validator";

export class UserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  role: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsDate()
  addedDate: Date;

  @IsDate()
  updatedDate: Date;
}
