import { Request, Response, NextFunction } from "express";
import { assertAuth } from "../auth/auth.guards";
import {
  archiveNote,
  createNote,
  deleteNote,
  getNoteDetails,
  listNotes,
  restoreNote,
  updateNote,
} from "./notes.service";
import {
  createNoteRequestSchema,
  listNotesQuerySchema,
  NoteDetails,
  noteParamsSchema,
  Notes,
  updateNoteRequestSchema,
} from "@notes/shared-types";

export const listNotesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertAuth(req);

  const { userId } = req;
  const { archived } = listNotesQuerySchema.parse(req.query);

  const response: Notes = await listNotes({ userId, archived });

  return res.status(200).send(response);
};

export const getNoteDetailsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertAuth(req);

  const { userId } = req;
  const { noteId } = noteParamsSchema.parse(req.params);

  const response: NoteDetails = await getNoteDetails({ userId, noteId });

  return res.status(200).send(response);
};

export const createNoteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertAuth(req);

  const { userId } = req;
  const { title, content, tags } = createNoteRequestSchema.parse(req.body);

  const response: NoteDetails = await createNote({
    userId,
    newNoteData: { title, content, tags },
  });

  return res.status(201).send(response);
};

export const updateNoteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertAuth(req);

  const { userId } = req;
  const { noteId } = noteParamsSchema.parse(req.params);
  const { title, content, tags } = updateNoteRequestSchema.parse(req.body);

  const response: NoteDetails = await updateNote({
    noteId,
    userId,
    updates: { title, content, tags },
  });

  return res.status(200).send(response);
};

export const deleteNoteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertAuth(req);

  const { userId } = req;
  const { noteId } = noteParamsSchema.parse(req.params);

  await deleteNote({ userId, noteId });

  return res.status(204).send();
};

export const archiveNoteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertAuth(req);

  const { userId } = req;
  const { noteId } = noteParamsSchema.parse(req.params);

  await archiveNote({ userId, noteId });

  return res.status(204).send();
};

export const restoreNoteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertAuth(req);

  const { userId } = req;
  const { noteId } = noteParamsSchema.parse(req.params);

  await restoreNote({ userId, noteId });

  return res.status(204).send();
};
