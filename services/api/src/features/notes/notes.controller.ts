import { Request, Response, NextFunction } from "express";
import { assertAuth } from "../auth/auth.guards";
import { getNoteById, listNotes } from "./notes.service";
import {
  listNotesQuerySchema,
  NoteDetails,
  noteParamsSchema,
  Notes,
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

export const getNoteByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertAuth(req);

  const { userId } = req;
  const { noteId } = noteParamsSchema.parse(req.params);

  const response: NoteDetails = await getNoteById({ userId, noteId });

  return res.status(200).send(response);
};
