import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { UserModel } from "../models/user-model";
import {
  generateTokens,
  verifyRefreshToken,
} from "../config/jwt-token-generation";

export class UserController {
  /**
   * Метод получения всех пользователей
   */
  static async getAllUsers(request: Request, response: Response) {
    try {
      const users = await AppDataSource.getRepository(UserModel).find();

      const safeUsers = users.map(({ passwordHash, ...rest }) => rest);

      response.json(safeUsers);
    } catch (error) {
      response.status(500).json({ message: "Ошибка сервера" });
    }
  }

  /**
   * Метод получения пользователя по ID
   */
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

  /**
   *
   * @param name - имя пользователя
   * @param email - почта
   * @param password - пароль
   * @returns {Record<string, string>} флаги ошибок
   */
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

  /**
   * Метод создания пользователя
   */
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

  static async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await AppDataSource.getRepository(UserModel).findOneBy({
      email,
    });

    if (!user || !(await user.checkPassword(password))) {
      return response
        .status(401)
        .json({ message: "Неверный email или пароль" });
    }

    const payload = { id: user.id, email: user.email };
    const { accessToken, refreshToken } = generateTokens(payload);

    response
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken });
  }

  static async refreshToken(request: Request, response: Response) {
    const { refreshToken } = request.cookies;

    if (!refreshToken) {
      return response.status(401).json({ message: "Нет refresh токена" });
    }

    try {
      const payload = verifyRefreshToken(refreshToken) as any;
      const newTokens = generateTokens({
        id: payload.id,
        email: payload.email,
      });

      response
        .cookie("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ accessToken: newTokens.accessToken });
    } catch {
      response.status(403).json({ message: "Недействительный refresh токен" });
    }
  }

  static async logout(request: Request, response: Response) {
    response.clearCookie("refreshToken").json({ message: "Выход выполнен" });
  }
}
