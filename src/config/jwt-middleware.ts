import { Request, Response } from "express";
import { verifyAccessToken } from "./jwt-token-generation";

export function authMiddleware(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет access токена" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const user = verifyAccessToken(token);
    (req as any).user = user;
    next();
  } catch {
    return res.status(403).json({ message: "Неверный access токен" });
  }
}
