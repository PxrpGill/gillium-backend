import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { TaskStatusModel } from "../models/task-status-model";
import { ProjectModel } from "../models/project-model";

export class TaskStatusController {
  static async createStatus(req: Request, res: Response) {
    const { name } = req.body;
    const projectId = Number(req.params.projectId);

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Неверное значение поля name" });
    }

    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({ error: "Неверный projectId" });
    }

    try {
      const projectRepo = AppDataSource.getRepository(ProjectModel);
      const project = await projectRepo.findOneBy({ id: projectId });

      if (!project) {
        return res.status(404).json({ error: "Проект не найден" });
      }

      const statusRepo = AppDataSource.getRepository(TaskStatusModel);
      const status = statusRepo.create({ name, project });
      const savedStatus = await statusRepo.save(status);

      return res.status(201).json(savedStatus);
    } catch (error) {
      console.error("Ошибка создания статуса:", error);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
  }
}
