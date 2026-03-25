import { z } from "./zod";

const noteBaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  tags: z.array(z.string()),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export const listNotesResponseSchema = z.array(noteBaseSchema);

export const noteDetailsResponseSchema = noteBaseSchema.extend({
  content: z.string(),
});

export const noteParamsSchema = z.object({
  noteId: z.string(),
});

export const listNotesQuerySchema = z.object({
  archived: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

export const updateNoteRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().max(100_000).optional(),
  tags: z.array(z.string().min(1)).optional(),
});

export const createNoteRequestSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(100_000),
  tags: z.array(z.string().min(1)),
});

export type ListNotesQuery = z.infer<typeof listNotesQuerySchema>;
export type Notes = z.infer<typeof listNotesResponseSchema>;
export type NoteDetails = z.infer<typeof noteDetailsResponseSchema>;
export type UpdateNoteRequest = z.infer<typeof updateNoteRequestSchema>;
export type CreateNoteRequest = z.infer<typeof createNoteRequestSchema>;
