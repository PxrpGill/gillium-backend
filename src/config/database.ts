import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: `./${process.env.DATA_BASE_NAME}`,
  synchronize: true,
  logging: false,
  entities: [User],
});
