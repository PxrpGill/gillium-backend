import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { UserModel } from "../models/user-model";

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await AppDataSource.getRepository(UserModel).find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}
