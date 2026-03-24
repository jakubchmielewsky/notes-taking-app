import { Router } from "express";
import {
  googleOAuthCallback,
  logout,
  logoutAll,
  redirectToGoogleOauth,
  refreshAccessToken,
} from "./auth.controller";
import { requireRefreshToken } from "./auth.middlewares";
import { refreshRateLimiter } from "../../middlewares/rateLimiters";

const authRouter = Router();

authRouter.get("/oauth/google", redirectToGoogleOauth);
authRouter.get("/oauth/google/callback", googleOAuthCallback);

authRouter.post(
  "/refresh",
  refreshRateLimiter,
  requireRefreshToken,
  refreshAccessToken,
);

authRouter.post("/logout", requireRefreshToken, logout);
authRouter.post("/logout-all", requireRefreshToken, logoutAll);

export { authRouter };
