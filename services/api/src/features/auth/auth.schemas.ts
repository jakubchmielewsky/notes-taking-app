export { accessTokenResponseSchema } from "@notes/shared-types";

import { z } from "../../config/zod";

export const oauthCallbackQuerySchema = z.object({
  code: z.string().openapi({
    description: "Authorization code returned by Google OAuth",
  }),
  state: z.string().optional().openapi({
    description: "Optional CSRF protection state value",
  }),
});
