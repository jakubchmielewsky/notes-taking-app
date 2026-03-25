import { env } from "./config/env";
import { createModuleLogger } from "./config/logger";

const processLogger = createModuleLogger("process");

process.on("uncaughtException", (err) => {
  processLogger.fatal({ err }, "Uncaught exception - shutting down");
  process.exit(1);
});

import "./config/zod";
import "./index.docs";
import { connectDB } from "./config/mongo";
import mongoose from "mongoose";
import app from "./app";

const SHUTDOWN_TIMEOUT_MS = 10_000;

connectDB();

const server = app.listen(env.API_PORT, () => {
  processLogger.info(`Server started listening on port ${env.API_PORT}`);
});

const shutdown = async (signal: string, exitCode = 0) => {
  processLogger.info(`${signal} received - starting graceful shutdown`);

  const forceExit = setTimeout(() => {
    processLogger.error("Graceful shutdown timed out - forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    processLogger.info("HTTP server closed");

    await mongoose.disconnect();
  } catch (err) {
    processLogger.error({ err }, "Error during graceful shutdown");
    exitCode = 1;
  } finally {
    clearTimeout(forceExit);
    process.exit(exitCode);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  processLogger.error({ reason }, "Unhandled promise rejection");
  shutdown("unhandledRejection", 1);
});
