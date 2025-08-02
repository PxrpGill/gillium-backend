import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserModel } from "../models/user-model";
import dotenv from "dotenv";
import { ProjectModel } from "../models/project-model";
import { ProjectUserRoleModel } from "../models/project-user-role";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: `./${process.env.DATA_BASE_NAME}`,
  synchronize: true,
  logging: false,
  entities: [UserModel, ProjectModel, ProjectUserRoleModel],
});
