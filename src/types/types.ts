import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface IObservation {
  id: number;
  scientific_name: string;
  common_name: string;
  discovery: string;
  public: boolean;
  identified: boolean;
  category: string;
  date: Date;
  description: string;
  addedDate: Date;
  updatedDate: Date;
  user: any;
  images: any[];
  location?: any;
  suggestions: ISuggestion[];
}

export interface IImage {
  id: number;
  imageName: string;
  addedDate: Date;
  observation: IObservation;
}

export interface ILocation {
  id: number;
  lat: number | null;
  lng: number | null;
  addedDate: Date;
  updatedDate: Date;
  observation: IObservation;
}

export interface CustomRequest extends Request {
  user?: JwtPayload;
}
export interface ILoginReturn {
  accessToken: string;
  refreshToken?: string;
  email: string;
  firstName: string;
  status: number;
  msg: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  addedDate: Date;
  updatedDate: Date;
  observations: IObservation[];
  suggestions: ISuggestion[];
}

export type CategoryType = "fauna" | "flora" | "funga";

export interface ISuggestion {
  id: number;
  suggested_name: string;
  date: Date;
  user: IUser;
  observation: IObservation;
}
