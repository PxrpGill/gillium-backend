import { Router } from "express";
import { ProjectController } from "../controllers/project-controller";

export const projectRoutes = Router();

projectRoutes.get("/projects", ProjectController.getAllProjects);
