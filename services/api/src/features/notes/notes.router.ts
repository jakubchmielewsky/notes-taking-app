import { Router } from "express";
import { requireAuth } from "../auth/auth.middlewares";
import {
  archiveNoteHandler,
  createNoteHandler,
  deleteNoteHandler,
  getNoteDetailsHandler,
  listNotesHandler,
  restoreNoteHandler,
  updateNoteHandler,
} from "./notes.controller";

const notesRouter = Router();

notesRouter.use(requireAuth);
notesRouter.get("/", listNotesHandler);
notesRouter.post("/", createNoteHandler);
notesRouter.get("/:noteId", getNoteDetailsHandler);
notesRouter.patch("/:noteId", updateNoteHandler);
notesRouter.post("/:noteId/archive", archiveNoteHandler);
notesRouter.post("/:noteId/restore", restoreNoteHandler);
notesRouter.delete("/:noteId", deleteNoteHandler);

export { notesRouter };
