import { NoteModel } from "./notes.model";
import { NoteDetails, Notes } from "@notes/shared-types";
import { ConflictError, NotFoundError } from "../../utils/errors";
import { NewNoteData, NoteUpdates } from "./notes.types";
import { randomBytes } from "crypto";
import { isDuplicateKeyError } from "../../utils/mongo";
import { slugify } from "../../utils/slugify";

const toNoteDetails = (note: {
  _id: unknown;
  title: string;
  slug: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}): NoteDetails => ({
  id: String(note._id),
  title: note.title,
  slug: note.slug,
  content: note.content,
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt.toISOString(),
  tags: note.tags,
});

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
    .select("_id title slug createdAt updatedAt tags")
    .sort({ updatedAt: -1 })
    .lean();

  return notes.map(({ _id, title, slug, createdAt, updatedAt, tags }) => ({
    id: _id.toString(),
    title,
    slug,
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
    .select("_id title slug content createdAt updatedAt tags")
    .lean();

  if (!note) throw new NotFoundError("Note");

  return toNoteDetails(note);
};

export const createNote = async ({
  newNoteData,
  userId,
}: {
  newNoteData: NewNoteData;
  userId: string;
}) => {
  const baseSlug = slugify(newNoteData.title);

  try {
    const newNote = await NoteModel.create({
      userId,
      slug: baseSlug,
      ...newNoteData,
    });
    return toNoteDetails(newNote);
  } catch (error) {
    if (!isDuplicateKeyError(error, "slug")) throw error;

    const suffix = randomBytes(3).toString("hex");
    const newNote = await NoteModel.create({
      userId,
      slug: `${baseSlug}-${suffix}`,
      ...newNoteData,
    });
    return toNoteDetails(newNote);
  }
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
  const baseSlug = updates.title ? slugify(updates.title) : undefined;

  const performUpdate = async (slug?: string) => {
    const updatedNote = await NoteModel.findOneAndUpdate(
      { _id: noteId, userId },
      { ...updates, ...(slug && { slug }) },
      { new: true },
    )
      .select("_id title slug content createdAt updatedAt tags")
      .lean();

    if (!updatedNote) throw new NotFoundError("Note");

    return toNoteDetails(updatedNote);
  };

  try {
    return await performUpdate(baseSlug);
  } catch (error) {
    if (!baseSlug || !isDuplicateKeyError(error, "slug")) throw error;

    const suffix = randomBytes(3).toString("hex");
    return await performUpdate(`${baseSlug}-${suffix}`);
  }
};

export const deleteNote = async ({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) => {
  const { deletedCount } = await NoteModel.deleteOne({ _id: noteId, userId });

  if (deletedCount === 0) throw new NotFoundError("Note");

  return;
};

export const archiveNote = async ({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) => {
  const { matchedCount } = await NoteModel.updateOne(
    { _id: noteId, userId, archivedAt: null },
    { archivedAt: new Date() },
  );

  if (matchedCount === 0) {
    const exists = await NoteModel.exists({ _id: noteId, userId });
    if (exists) throw new ConflictError("Note is already archived");
    throw new NotFoundError("Note");
  }

  return;
};

export const restoreNote = async ({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) => {
  const { matchedCount } = await NoteModel.updateOne(
    { _id: noteId, userId, archivedAt: { $ne: null } },
    { archivedAt: null },
  );

  if (matchedCount === 0) {
    const exists = await NoteModel.exists({ _id: noteId, userId });
    if (exists) throw new ConflictError("Note is not archived");
    throw new NotFoundError("Note");
  }

  return;
};
