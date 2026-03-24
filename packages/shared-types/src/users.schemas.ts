import { z } from "./zod";

export const currentUserResponseSchema = z
  .object({
    email: z.email().openapi({ description: "User email address" }),
    emailVerified: z.boolean().openapi({
      description: "Whether the email address is verified",
    }),
    profile: z.object({
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      fullName: z.string().nullable(),
      avatarUrl: z.url().nullable(),
      source: z.enum(["provider", "user"]).openapi({
        description: "Profile data origin",
      }),
    }),
  })
  .strict();

export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
export type UserProfile = CurrentUserResponse["profile"];
