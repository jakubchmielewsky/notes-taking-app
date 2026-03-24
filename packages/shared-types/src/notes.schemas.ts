import { z } from "./zod";

const noteBaseSchema = z.object({
  id: z.string(),
  title: z.string(),
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

export type ListNotesQuery = z.infer<typeof listNotesQuerySchema>;
export type Notes = z.infer<typeof listNotesResponseSchema>;
export type NoteDetails = z.infer<typeof noteDetailsResponseSchema>;
