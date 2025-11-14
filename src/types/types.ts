import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface IObservation {
  id: number;
  isDomestic: boolean;
  needToShare: boolean;
  needIdentification: boolean;
  category: string;
  dateOfObservation: Date;
  description: string;
  addedDate: Date;
  updatedDate: Date;
  user: any;
  images: any[];
  location?: any;
}

export interface IImage {
  id: number;
  imageName: string;
  addedDate: Date;
  observation: IObservation;
}

export interface ILocation {
  id: number;
  latitude: number;
  longitude: number;
  addedDate: Date;
  updatedDate: Date;
  observation: IObservation;
}

export interface CustomRequest extends Request {
  user?: JwtPayload;
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
}

export type CategoryType = "fauna" | "flora" | "funga";
