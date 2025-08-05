import { Router } from "express";
import { ProjectController } from "../controllers/project-controller";
import { authMiddleware } from "../config/jwt-middleware";

export const projectRoutes = Router();

projectRoutes.get(
  "/projects",
  authMiddleware,
  ProjectController.getUserProjects
);

projectRoutes.get(
  "/project/:slug",
  authMiddleware,
  ProjectController.getUserProjectBySlug
);

projectRoutes.post("/project", authMiddleware, ProjectController.createProject);

projectRoutes.post(
  "/project/:id/column",
  authMiddleware,
  ProjectController.createTaskColumn
);

projectRoutes.post(
  "/project/:id/task",
  authMiddleware,
  ProjectController.createTask
);
