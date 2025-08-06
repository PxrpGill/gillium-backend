import { Router } from "express";
import { authMiddleware } from "../config/jwt-middleware";
import { TaskColumnController } from "../controllers/task-column-controller";

export const taskColumnRoutes = Router();

taskColumnRoutes.post(
  "/project/:slug/column",
  authMiddleware,
  TaskColumnController.createTaskColumn
);
