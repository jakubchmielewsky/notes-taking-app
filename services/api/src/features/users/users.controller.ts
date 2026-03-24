import { Request, Response } from "express";
import { getUserMe } from "./users.service";
import { CurrentUserResponse } from "@notes/shared-types";
import { assertAuth } from "../auth/auth.guards";

export const getMe = async (req: Request, res: Response) => {
  assertAuth(req);

  const response: CurrentUserResponse = await getUserMe(req.userId);

  return res.status(200).json(response);
};
