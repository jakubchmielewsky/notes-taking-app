import { Router } from "express";
import { requireAuth } from "../auth/auth.middlewares";
import {
  getNoteDetailsHandler,
  listNotesHandler,
  updateNoteHandler,
} from "./notes.controller";

const notesRouter = Router();

notesRouter.use(requireAuth);
notesRouter.get("/", listNotesHandler);
notesRouter.get("/:noteId", getNoteDetailsHandler);
notesRouter.patch("/:noteId", updateNoteHandler);

export { notesRouter };
