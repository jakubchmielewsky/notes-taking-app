import { registry } from "../../config/openapi";
import {
  oauthCallbackQuerySchema,
  accessTokenResponseSchema,
} from "./auth.schemas";

registry.registerPath({
  tags: ["Auth"],
  method: "get",
  path: "/api/v1/auth/oauth/google",
  summary: "Start Google OAuth authentication",
  description: `
Initiates the Google OAuth 2.0 authentication flow.

The endpoint redirects the user to Google's consent screen.
No authentication is required.
`,
  responses: {
    302: {
      description: "Redirect to Google OAuth consent screen",
    },
  },
});

registry.registerPath({
  tags: ["Auth"],
  method: "get",
  path: "/api/v1/auth/oauth/google/callback",
  summary: "Handle Google OAuth callback",
  description: `
Handles the callback from Google OAuth.

- Verifies the authorization code
- Creates or updates the user account
- Issues authentication tokens
- Sets refresh token as an HTTP-only cookie
- Redirects the user back to the frontend application
`,
  request: {
    query: oauthCallbackQuerySchema,
  },
  responses: {
    302: {
      description: "Authentication successful, user redirected to frontend",
    },
    401: {
      description: "Invalid or expired authorization code",
    },
    502: {
      description: "Google OAuth provider error",
    },
  },
});

registry.registerPath({
  tags: ["Auth"],
  method: "post",
  path: "/api/v1/auth/refresh",
  summary: "Refresh access token",
  description: `
Issues a new access token using a valid refresh token.

- Requires refresh token stored in HTTP-only cookie
- Performs refresh token rotation
`,
  responses: {
    200: {
      description: "New access token issued",
      content: {
        "application/json": {
          schema: accessTokenResponseSchema,
        },
      },
    },
    401: {
      description: "Missing, invalid or revoked refresh token",
    },
  },
});

registry.registerPath({
  tags: ["Auth"],
  method: "post",
  path: "/api/v1/auth/logout",
  summary: "Logout current user",
  description: `
Logs out the currently authenticated user.

- Revokes the active refresh token
- Clears authentication cookies
`,
  responses: {
    204: {
      description: "User successfully logged out",
    },
  },
});

registry.registerPath({
  tags: ["Auth"],
  method: "post",
  path: "/api/v1/auth/logout-all",
  summary: "Logout all current user sessions",
  description: `
Logs out the currently authenticated user on all devices.

- Revokes all active refresh tokens for the user
- Clears authentication cookies for the current client
`,
  responses: {
    204: {
      description: "All user sessions successfully revoked",
    },
  },
});
