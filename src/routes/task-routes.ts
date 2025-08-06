import { Router } from "express";
import { TaskController } from "../controllers/task-controller";
import { authMiddleware } from "../config/jwt-middleware";

export const taskRoutes = Router();

taskRoutes.post(
  "/project/:slug/column/:columnId/task",
  authMiddleware,
  TaskController.createTask
);
