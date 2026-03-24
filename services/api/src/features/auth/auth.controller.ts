import { CookieOptions, Request, Response } from "express";
import {
  createGoogleOAuthUrl,
  exchangeCodeForTokens,
  generateTokenPair,
  getGoogleUserData,
  revokeAllSessions,
  revokeSession,
  rotateRefreshToken,
} from "./auth.service";
import { oauthCallbackQuerySchema } from "./auth.schemas";
import { findOrCreateGoogleUser } from "../users/users.service";
import { env } from "../../config/env";
import ms, { StringValue } from "ms";
import { UnauthorizedError } from "../../utils/errors";
import { randomUUID } from "crypto";
import { authLogger } from "./auth.logger";
import { assertRefreshToken } from "./auth.guards";
import { AccessTokenResponse } from "@notes/shared-types";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/v1/auth/",
  maxAge: ms(env.REFRESH_TOKEN_EXPIRES_IN as StringValue),
};

export const redirectToGoogleOauth = (req: Request, res: Response) => {
  const state = randomUUID();

  const redirectUrl = createGoogleOAuthUrl(state);

  res.cookie("oauthState", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: ms("5m"),
  });

  return res.redirect(redirectUrl);
};

export const googleOAuthCallback = async (req: Request, res: Response) => {
  const { code, state } = oauthCallbackQuerySchema.parse(req.query);

  const storedState = req.cookies?.oauthState;

  if (!storedState || storedState !== state) {
    authLogger.warn("Invalid OAuth state in Google callback");
    throw new UnauthorizedError("Invalid OAuth state");
  }

  res.clearCookie("oauthState");

  const tokens = await exchangeCodeForTokens(code);
  const googleUser = await getGoogleUserData(tokens.access_token);
  const user = await findOrCreateGoogleUser(googleUser);

  authLogger.info({ userId: user._id }, "User logged in via Google OAuth");

  const { refreshToken } = await generateTokenPair(String(user._id));

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.redirect(env.FRONTEND_URI);
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  assertRefreshToken(req);
  const refreshTokenFromCookie = req.refreshToken;

  const { accessToken, refreshToken } = await rotateRefreshToken(
    refreshTokenFromCookie,
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  const response: AccessTokenResponse = { accessToken };

  res.status(200).json(response);
};

export const logout = async (req: Request, res: Response) => {
  assertRefreshToken(req);

  await revokeSession(req.refreshToken);

  res.clearCookie("refreshToken", { path: "/api/v1/auth/" });
  return res.status(204).send();
};

export const logoutAll = async (req: Request, res: Response) => {
  assertRefreshToken(req);

  const refreshToken = req.refreshToken;

  await revokeAllSessions(refreshToken);

  res.clearCookie("refreshToken", { path: "/api/v1/auth/" });
  return res.status(204).send();
};
