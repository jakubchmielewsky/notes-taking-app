import { NoteModel } from "./notes.model";
import { NoteDetails, Notes } from "@notes/shared-types";
import { NotFoundError } from "../../utils/errors";

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

export const getNoteById = async ({
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
