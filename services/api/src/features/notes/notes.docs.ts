import { registry } from "../../config/openapi";
import {
  createNoteRequestSchema,
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
  method: "post",
  path: "/api/v1/notes",
  summary: "Create note",
  description: `
Creates a new note for the authenticated user.

- Slug is auto-generated from the title
`,
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createNoteRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created note details",
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
  method: "post",
  path: "/api/v1/notes/{noteId}/archive",
  summary: "Archive note",
  description: `
Archives a note owned by the authenticated user.

- Returns 409 if the note is already archived
`,
  security: [{ bearerAuth: [] }],
  request: {
    params: noteParamsSchema,
  },
  responses: {
    204: {
      description: "Note archived successfully",
    },
    409: {
      description: "Note is already archived",
    },
  },
});

registry.registerPath({
  tags: ["Notes"],
  method: "post",
  path: "/api/v1/notes/{noteId}/restore",
  summary: "Restore note",
  description: `
Restores an archived note owned by the authenticated user.

- Returns 409 if the note is not archived
`,
  security: [{ bearerAuth: [] }],
  request: {
    params: noteParamsSchema,
  },
  responses: {
    204: {
      description: "Note restored successfully",
    },
    409: {
      description: "Note is not archived",
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
