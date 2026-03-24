import { registry } from "../../config/openapi";
import {
  listNotesQuerySchema,
  listNotesResponseSchema,
  noteDetailsResponseSchema,
  noteParamsSchema,
} from "@notes/shared-types";

registry.registerPath({
  tags: ["Notes"],
  method: "get",
  path: "/api/v1/notes",
  summary: "List notes",
  description: `
Returns a list of notes for the authenticated user.

- Supports filtering by archived status via query parameter
- Notes are sorted by last update date (newest first)
- Content is not included in the list response
`,
  security: [{ bearerAuth: [] }],
  request: {
    query: listNotesQuerySchema,
  },
  responses: {
    200: {
      description: "List of notes",
      content: {
        "application/json": {
          schema: listNotesResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
  },
});

registry.registerPath({
  tags: ["Notes"],
  method: "get",
  path: "/api/v1/notes/{noteId}",
  summary: "Get note by ID",
  description: `
Returns the full details of a single note, including content.

- Only returns notes owned by the authenticated user
`,
  security: [{ bearerAuth: [] }],
  request: {
    params: noteParamsSchema,
  },
  responses: {
    200: {
      description: "Note details",
      content: {
        "application/json": {
          schema: noteDetailsResponseSchema,
        },
      },
    },
  },
});
