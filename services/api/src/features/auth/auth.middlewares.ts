import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../../utils/errors";
import { env } from "../../config/env";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(" ")[1];

  if (!token) throw new UnauthorizedError();

  try {
    const payload = jwt.verify(
      token,
      env.JWT_ACCESS_TOKEN_SECRET,
    ) as JwtPayload;

    if (!payload.sub) throw new UnauthorizedError("Invalid token");

    req.log = req.log.child({ userId: payload.sub });
    (req as any).userId = payload.sub;
    next();
  } catch (error) {
    req.log.warn({ err: error }, "JWT validation failed");
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export const requireRefreshToken = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken || typeof refreshToken !== "string") {
    throw new UnauthorizedError();
  }

  (req as any).refreshToken = refreshToken;
  next();
};
