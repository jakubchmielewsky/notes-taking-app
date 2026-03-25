import { NoteModel } from "./notes.model";
import { NoteDetails, Notes } from "@notes/shared-types";
import { NotFoundError } from "../../utils/errors";
import { NoteUpdates } from "./notes.types";

export const listNotes = async ({
  userId,
  archived,
}: {
  userId: string;
  archived?: boolean;
}): Promise<Notes> => {
  const notes = await NoteModel.find({
    userId,
    archivedAt: archived ? { $ne: null } : null,
  })
    .select("_id title createdAt updatedAt tags")
    .sort({ updatedAt: -1 })
    .lean();

  return notes.map(({ _id, title, createdAt, updatedAt, tags }) => ({
    id: _id.toString(),
    title,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    tags,
  }));
};

export const getNoteDetails = async ({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}): Promise<NoteDetails> => {
  const note = await NoteModel.findOne({ _id: noteId, userId })
    .select("_id title content createdAt updatedAt tags")
    .lean();

  if (!note) throw new NotFoundError("Note");

  return {
    id: note._id.toString(),
    title: note.title,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
    tags: note.tags,
  };
};

export const updateNote = async ({
  updates,
  noteId,
  userId,
}: {
  updates: NoteUpdates;
  noteId: string;
  userId: string;
}) => {
  const updatedNote = await NoteModel.findOneAndUpdate(
    { _id: noteId, userId },
    updates,
  )
    .select("_id title content createdAt updatedAt tags")
    .lean();

  if (!updatedNote) throw new NotFoundError("Note");

  return {
    id: updatedNote._id.toString(),
    title: updatedNote.title,
    content: updatedNote.content,
    createdAt: updatedNote.createdAt.toISOString(),
    updatedAt: updatedNote.updatedAt.toISOString(),
    tags: updatedNote.tags,
  };
};

export const deleteNote = async ({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) => {
  const deletedNote = await NoteModel.findOneAndDelete({ _id: noteId, userId });

  if (!deletedNote) throw new NotFoundError("Note");

  return;
};
