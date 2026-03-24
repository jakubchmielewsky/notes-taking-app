import { registry } from "../../config/openapi";
import { currentUserResponseSchema } from "@notes/shared-types";

registry.registerPath({
  tags: ["Users"],
  method: "get",
  path: "/api/v1/users/me",
  summary: "Get current user profile",
  description: `
Returns information about the currently authenticated user.
`,
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Authenticated user data",
      content: {
        "application/json": {
          schema: currentUserResponseSchema,
        },
      },
    },
  },
});
