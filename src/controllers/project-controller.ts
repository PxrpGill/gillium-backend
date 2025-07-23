import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { ProjectModel } from "../models/project-model";

export class ProjectController {
  static async getAllProjects(request: Request, response: Response) {
    try {
      const projects = AppDataSource.getRepository(ProjectModel).find();
      response.json(projects);
    } catch {
      response.status(500).json({ message: "Ошибка сервера" });
    }
  }
}
