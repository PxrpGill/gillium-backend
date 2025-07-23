import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { UserModel } from "../models/user";

const userRoutes = Router();

userRoutes.get("/users", async (request: Request, response: Response) => {
  const users = await AppDataSource.getRepository(UserModel).find();
  response.json(users);
});

export default userRoutes;
