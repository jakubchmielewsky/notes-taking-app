import { Router } from "express";
import { requireAuth } from "../auth/auth.middlewares";
import { getNoteByIdHandler, listNotesHandler } from "./notes.controller";

const notesRouter = Router();

notesRouter.use(requireAuth);
notesRouter.get("/", listNotesHandler);
notesRouter.get("/:noteId", getNoteByIdHandler);

export { notesRouter };
