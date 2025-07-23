import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import { User } from "./models/user";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT ?? 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Connected to the database");

    app.get("/", async (req: Request, res: Response) => {
      const users = await AppDataSource.getRepository(User).find();
      res.json(users);
    });

    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("❌ Error during Data Source initialization:", error);
  });
