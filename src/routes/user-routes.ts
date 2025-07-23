import { Router } from "express";
import { UserController } from "../controllers/user-controller";

export const userRoutes = Router();

userRoutes.get("/users", UserController.getAllUsers);
userRoutes.get("/user/id/:id", UserController.getUserById);
userRoutes.post("/user", UserController.createUser);
