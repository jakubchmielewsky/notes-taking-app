import { InferSchemaType } from "mongoose";
import { noteSchema } from "./notes.model";

export type Note = InferSchemaType<typeof noteSchema>;
export type NoteUpdates = Partial<Pick<Note, "title" | "content" | "tags">>;
export type NewNoteData = Pick<Note, "title" | "content" | "tags">;
