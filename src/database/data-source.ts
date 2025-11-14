import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User.js";

import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "abc123",
  database: process.env.DB_NAME || "nature-diary",
  synchronize: false,
  logging: true,
  entities: [User],
  migrations: ["src/migrations/*.ts"],
});
