import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { AppError, BadRequestError } from "../utils/errors";

function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof ZodError) {
    const details = err.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    return new BadRequestError(`Invalid input: ${details}`);
  }

  if (err instanceof mongoose.Error.CastError) {
    return new BadRequestError(`Invalid ${err.path}: ${err.value}`);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return new BadRequestError(`Invalid input data: ${messages.join(", ")}`);
  }

  if (
    err instanceof Error &&
    "code" in err &&
    (err as { code: unknown }).code === 11000
  ) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    const value = keyValue ? Object.values(keyValue).join(", ") : "unknown";
    return new AppError(409, `Duplicate field value: ${value}`);
  }

  return new AppError(500, "Something went wrong");
}

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const normalized = normalizeError(err);

  req.log.error({ err }, normalized.message);

  res.status(normalized.status).json({
    message: normalized.message,
  });
};

export default globalErrorHandler;
