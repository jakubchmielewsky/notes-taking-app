import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { env } from "./env";
import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi";

export const generator = new OpenApiGeneratorV31(registry.definitions);

export const openApiDoc = generator.generateDocument({
  openapi: "3.1.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
  },
});

openApiDoc.components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "JWT access token obtained from /auth/refresh endpoint",
    },
  },
};

export const setupSwagger = (app: Express): void => {
  if (env.NODE_ENV !== "production") {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
  }
};
