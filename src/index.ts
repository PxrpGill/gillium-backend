import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import { UserModel } from "./models/user";
import userRoutes from "./routes/user-routes";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT ?? 3000;

app.use(express.json());
app.use("/", userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Connected to the database");

    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("❌ Error during Data Source initialization:", error);
  });
