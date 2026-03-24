import { Router } from "express";
import { getMe } from "./users.controller";
import { requireAuth } from "../auth/auth.middlewares";

const usersRouter = Router();

usersRouter.get("/me", requireAuth, getMe);

export { usersRouter };
