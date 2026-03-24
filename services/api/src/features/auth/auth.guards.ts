import { UnauthorizedError } from "../../utils/errors";
import { Request } from "express";

export const assertRefreshToken: (
  req: Request,
) => asserts req is Request & { refreshToken: string } = (req) => {
  if (typeof req.refreshToken !== "string") {
    throw new UnauthorizedError();
  }
};

export const assertAuth: (
  req: Request,
) => asserts req is Request & { userId: string } = (req) => {
  if (typeof req.userId !== "string") {
    throw new UnauthorizedError();
  }
};
