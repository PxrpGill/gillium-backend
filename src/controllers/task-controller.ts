import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { TaskColumnModel } from "../models/task-column-model";
import { TaskModel } from "../models/task-model";

export class TaskController {
  /**
   * Метод создания задачи
   */
  static async createTask(req: Request, res: Response) {
    const user = (req as any).user;
    const { slug, columnId } = req.params;
    const { title, description, estimatedTimeHours } = req.body;

    try {
      const column = await AppDataSource.getRepository(
        TaskColumnModel
      ).findOneBy({
        id: parseInt(columnId),
      });

      if (!column) {
        return res.status(404).json({ message: "Колонка не найдена" });
      }

      const task = AppDataSource.getRepository(TaskModel).create({
        title,
        description,
        estimatedTimeHours,
        column,
        creator: user,
      });

      await AppDataSource.getRepository(TaskModel).save(task);

      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка при создании задачи" });
    }
  }
}
