import mongoose from "mongoose";
import { env } from "./env";
import { dbLogger } from "./logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    dbLogger.info("Connected to MongoDB");
  } catch (error) {
    dbLogger.error({ err: error }, "MongoDB connection failed");
  }

  mongoose.connection.on("error", (error) => {
    dbLogger.error({ err: error }, "MongoDB error");
  });

  mongoose.connection.on("disconnected", () => {
    dbLogger.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    dbLogger.info("MongoDB reconnected");
  });
};
