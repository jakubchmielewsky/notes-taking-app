import { z } from "./zod";

export const accessTokenResponseSchema = z
  .object({
    accessToken: z.string().openapi({
      description: "JWT access token used for authenticated API requests",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    }),
  })
  .strict();

export type AccessTokenResponse = z.infer<typeof accessTokenResponseSchema>;
