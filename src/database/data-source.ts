import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import { Observation } from "../entities/Observation.js";
import { Image } from "../entities/Image.js";
import { Location } from "../entities/Location.js";

import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "abc123",
  database: process.env.DB_NAME || "nature-diary",
  synchronize: process.env.NODE_ENV === "development",
  logging: true,
  entities: [User, Observation, Image, Location],
  migrations: ["src/migrations/*.ts"],
});
