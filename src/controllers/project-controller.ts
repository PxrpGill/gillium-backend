import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { ProjectModel } from "../models/project-model";
import { UserModel } from "../models/user-model";
import { ProjectUserRoleModel } from "../models/project-user-role";
import { instanceToPlain } from "class-transformer";

export class ProjectController {
  /**
   * Метод получения всех проектов
   */
  static async getUserProjects(request: Request, response: Response) {
    const user = (request as any).user;

    if (!user) {
      return response
        .status(401)
        .json({ message: "Пользователь не авторизован" });
    }

    try {
      const projects = await AppDataSource.getRepository(ProjectModel).find({
        where: { owner: { id: user.id } },
        relations: ["owner"],
      });

      return response.status(200).json(instanceToPlain(projects));
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Ошибка сервера" });
    }
  }

  /**
   * Метод получения проекта по слагу
   * с колонками и задачами
   */
  static async getUserProjectBySlug(request: Request, response: Response) {
    const user = (request as any).user;

    if (!user) {
      return response
        .status(401)
        .json({ message: "Пользователь не авторизован" });
    }

    const slug = request.params.slug;

    if (!slug) {
      return response
        .status(400)
        .json({ message: "Некорректный slug проекта" });
    }

    try {
      const project = await AppDataSource.getRepository(ProjectModel).findOne({
        where: {
          slug,
          owner: { id: user.id },
        },
        relations: {
          owner: true,
          columns: {
            tasks: {
              creator: true,
            },
          },
        },
      });

      if (!project) {
        return response.status(404).json({ message: "Проект не найден" });
      }

      return response.status(200).json(instanceToPlain(project));
    } catch (error) {
      console.error("Произошла ошибка при получении проекта:", error);
      return response.status(500).json({ message: "Ошибка сервера" });
    }
  }

  /**
   * Метод создания проекта авторизированным пользователем
   */
  static async createProject(req: Request, res: Response) {
    const { name } = req.body;
    const user = (req as any).user;

    try {
      const userRecord = await AppDataSource.getRepository(UserModel).findOneBy(
        { id: user.id }
      );
      if (!userRecord) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const project = new ProjectModel();
      project.name = name;
      project.owner = userRecord;

      await AppDataSource.getRepository(ProjectModel).save(project);

      const projectUser = new ProjectUserRoleModel();
      projectUser.project = project;
      projectUser.user = userRecord;
      projectUser.role = "admin";

      await AppDataSource.getRepository(ProjectUserRoleModel).save(projectUser);

      return res.status(201).json({
        project: {
          ...project,
          owner: {
            id: project.owner.id,
            name: project.owner.name,
            email: project.owner.email,
          },
          slug: project.slug,
          id: project.id,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Ошибка при создании проекта",
        details: (error as any).message,
      });
    }
  }
}
