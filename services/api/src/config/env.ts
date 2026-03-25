import z from "zod";
import { createModuleLogger } from "./logger";

const processLogger = createModuleLogger("process");

const EnvSchema = z.object({
  // Application
  NODE_ENV: z.enum(["development", "production"]),
  API_PORT: z.coerce.number().min(1).max(65535),
  FRONTEND_URI: z.string().min(1),
  // Infrastructure
  MONGO_URI: z.string().min(1),
  // Auth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().min(1),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(1),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  processLogger.error(
    { issues: parsed.error.issues },
    "Invalid environment variables",
  );
  process.exit(1);
}

export const env = parsed.data;
