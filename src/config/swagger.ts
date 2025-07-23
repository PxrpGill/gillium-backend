import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gillium Backend API",
      version: "1.0.0",
      description: "Автоматически сгенерированная документация API",
    },
  },
  apis: ["./routes/project-routes.ts"],
};

export const swaggerOptions = swaggerJsdoc(options);
