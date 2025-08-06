import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { ProjectModel } from "../models/project-model";
import { TaskColumnModel } from "../models/task-column-model";

export class TaskColumnController {
  /**
   * Метод создания столбца задач
   */
  static async createTaskColumn(req: Request, res: Response) {
    const user = (req as any).user;
    const projectSlug = req.params.slug;
    const { name } = req.body;

    try {
      const project = await AppDataSource.getRepository(ProjectModel).findOneBy(
        {
          slug: projectSlug,
          owner: { id: user.id },
        }
      );

      if (!project) {
        return res.status(404).json({ message: "Проект не найден" });
      }

      const column = AppDataSource.getRepository(TaskColumnModel).create({
        name,
        project,
      });

      await AppDataSource.getRepository(TaskColumnModel).save(column);

      return res.status(201).json(column);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}
