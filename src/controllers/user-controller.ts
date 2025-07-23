import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { UserModel } from "../models/user-model";

export class UserController {
  static async getAllUsers(request: Request, response: Response) {
    try {
      const users = await AppDataSource.getRepository(UserModel).find();

      const safeUsers = users.map(({ passwordHash, ...rest }) => rest);

      response.json(safeUsers);
    } catch (error) {
      response.status(500).json({ message: "Ошибка сервера" });
    }
  }

  static async getUserById(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);

      if (!id) {
        return response
          .status(400)
          .json({ message: "Некорректный ID пользователя" });
      }

      try {
        const user = await AppDataSource.getRepository(UserModel).findOneBy({
          id,
        });

        if (!user) {
          return response
            .status(404)
            .json({ message: "Пользователь не найден" });
        }

        const { passwordHash, ...safeUser } = user;

        return response.status(200).json(safeUser);
      } catch (error) {
        console.error("Произошла ошибка при получении пользователя по ID");

        return response.status(500).json({ message: "Ошибка сервера" });
      }
    } catch (error) {
      return response.status(500).json({ message: "Ошибка сервера" });
    }
  }

  static async validateRegisterFields(
    name: string | undefined,
    email: string | undefined,
    password: string | undefined
  ) {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.trim() === "") {
      errors.emptyName = "Поле 'Имя пользователя' не должно быть пустым";
    } else if (name.length < 2) {
      errors.shortName = "Имя пользователя должно содержать минимум 2 символа";
    }

    if (!email || email.trim() === "") {
      errors.emptyEmail = "Поле 'Email' не должно быть пустым";
    } else if (!emailRegex.test(email)) {
      errors.invalidEmail = "Некорректный формат email";
    }

    if (!password || password.trim() === "") {
      errors.emptyPassword = "Поле 'Пароль' не должно быть пустым";
    } else if (password.length < 6) {
      errors.shortPassword = "Пароль должен содержать минимум 6 символов";
    }

    return errors;
  }

  static async createUser(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const errors = await UserController.validateRegisterFields(
      name,
      email,
      password
    );

    if (Object.keys(errors).length > 0) {
      return response.status(400).json({
        message: "Ошибка валидации",
        errors,
      });
    }

    try {
      const userRepo = AppDataSource.getRepository(UserModel);

      const existingUser = await userRepo.findOneBy({ email });
      if (existingUser) {
        return response.status(409).json({
          message: "Пользователь с таким email уже существует",
        });
      }

      const user = new UserModel();
      user.name = name;
      user.email = email;

      await user.setPassword(password);
      await userRepo.save(user);

      const { passwordHash, ...userData } = user;

      return response
        .status(201)
        .json({ message: `Пользователь ${userData.name} был успешно создан!` });
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      return response.status(500).json({ message: "Ошибка сервера" });
    }
  }
}
