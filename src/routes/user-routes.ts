import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { authMiddleware } from "../config/jwt-middleware";

export const userRoutes = Router();

userRoutes.get("/users", authMiddleware, UserController.getAllUsers);
userRoutes.get("/user/id/:id", authMiddleware, UserController.getUserById);
userRoutes.post("/user/register", UserController.createUser);
userRoutes.post("/user/login", UserController.login);

userRoutes.post("/user/logout", authMiddleware, UserController.logout);
userRoutes.post("/refresh", UserController.refreshToken);
