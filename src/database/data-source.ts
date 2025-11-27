import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import { Observation } from "../entities/Observation.js";
import { Image } from "../entities/Image.js";
import { Location } from "../entities/Location.js";
import { Suggestion } from "../entities/Suggestion.js";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const productionConfig = {
  type: "postgres",
  synchronize: process.env.SYNC === "true",
  logging: false,
  entities: ["dist/src/entities/*.js"],
  migrations: ["dist/src/migrations/*.js"],
} as any;

// Only add url when present
if (process.env.DATABASE_URL) {
  productionConfig.url = process.env.DATABASE_URL;
  productionConfig.ssl = { rejectUnauthorized: false };
}

export const AppDataSource = new DataSource(
  isProduction
    ? productionConfig
    : {
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5433,
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASS || "abc123",
        database: process.env.DB_NAME || "nature-diary",
        synchronize: true,
        logging: true,
        entities: [User, Observation, Image, Location, Suggestion],
        migrations: ["src/migrations/*.ts"],
      }
);
