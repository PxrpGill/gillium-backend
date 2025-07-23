import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { UserModel } from "../models/user-model";

export class UserController {
  static async getAllUsers(request: Request, response: Response) {
    try {
      const users = await AppDataSource.getRepository(UserModel).find();
      response.json(users);
    } catch (error) {
      response.status(500).json({ message: "Ошибка сервера" });
    }
  }
}
