import rateLimit, { RateLimitExceededEventHandler } from "express-rate-limit";
import { logger } from "../config/logger";
import ms from "ms";

const rateLimitHandler: RateLimitExceededEventHandler = (
  req,
  res,
  _next,
  options,
) => {
  logger.warn(
    { ip: req.ip, method: req.method, path: req.path },
    "Rate limit exceeded",
  );
  res.status(options.statusCode).json({ message: options.message });
};

export const globalRateLimiter = rateLimit({
  windowMs: ms("1m"),
  max: 100,
  message: "Too many requests, please try again later.",
  handler: rateLimitHandler,
});

export const refreshRateLimiter = rateLimit({
  windowMs: ms("15m"),
  max: 30,
  message: "Too many refresh requests, please try again later.",
  handler: rateLimitHandler,
});
