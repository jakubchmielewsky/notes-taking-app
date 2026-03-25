import { registry } from "../../config/openapi";
import {
  listNotesQuerySchema,
  listNotesResponseSchema,
  noteDetailsResponseSchema,
  noteParamsSchema,
  updateNoteRequestSchema,
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

registry.registerPath({
  tags: ["Notes"],
  method: "patch",
  path: "/api/v1/notes/{noteId}",
  summary: "Update note",
  description: `
Updates an existing note owned by the authenticated user.

- All fields are optional — only provided fields are updated
- Returns the full updated note details
`,
  security: [{ bearerAuth: [] }],
  request: {
    params: noteParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateNoteRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated note details",
      content: {
        "application/json": {
          schema: noteDetailsResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  tags: ["Notes"],
  method: "delete",
  path: "/api/v1/notes/{noteId}",
  summary: "Delete note",
  description: `
Deletes a note owned by the authenticated user.
`,
  security: [{ bearerAuth: [] }],
  request: {
    params: noteParamsSchema,
  },
  responses: {
    204: {
      description: "Note deleted successfully",
    },
  },
});
