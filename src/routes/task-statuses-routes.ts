// routes/task-status-routes.ts
import { Router } from "express";
import { TaskStatusController } from "../controllers/task-status-controller";
import { authMiddleware } from "../config/jwt-middleware";

export const taskStatusRoutes = Router();

taskStatusRoutes.post(
  "/project/:projectId/status",
  authMiddleware,
  TaskStatusController.createStatus
);
