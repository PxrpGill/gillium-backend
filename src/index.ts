import "reflect-metadata";
import express, { Express } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import AppRoutes from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./config/swagger";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT ?? 3000;

app.use(express.json());
app.use("/", AppRoutes.userRoutes);
app.use("/", AppRoutes.projectRoutes);
app.use("/", AppRoutes.taskRoutes);
app.use("/", AppRoutes.taskColumnRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

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
