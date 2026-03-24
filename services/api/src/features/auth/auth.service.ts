import { env } from "../../config/env";
import { UnauthorizedError, BadGatewayError } from "../../utils/errors";
import {
  GoogleTokenResponse,
  GoogleUserInfo,
  JwtPayload,
  TokenPair,
} from "./auth.types";
import jwt from "jsonwebtoken";
import { RefreshTokenModel } from "./refreshToken.model";
import ms, { StringValue } from "ms";
import crypto from "crypto";
import { authLogger } from "./auth.logger";

export const hashRefreshToken = (token: string) =>
  crypto
    .createHmac("sha256", env.REFRESH_TOKEN_SECRET)
    .update(token)
    .digest("hex");

export const generateTokenPair = async (userId: string): Promise<TokenPair> => {
  const payload: JwtPayload = { sub: userId };

  const accessToken = jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue,
  });

  const refreshToken = crypto.randomBytes(64).toString("hex");

  const refreshTokenHash = hashRefreshToken(refreshToken);

  await RefreshTokenModel.create({
    userId,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(
      Date.now() + ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue),
    ),
  });

  return { accessToken, refreshToken };
};

export const createGoogleOAuthUrl = (state: string) => {
  const googleOAuthBaseUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const searchParams = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI,
    access_type: "offline",
    response_type: "code",
    scope: "openid email profile",
    prompt: "consent",
    state,
  });

  return `${googleOAuthBaseUrl}?${searchParams.toString()}`;
};

export const exchangeCodeForTokens = async (
  authorizationCode: string,
): Promise<GoogleTokenResponse> => {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    code: authorizationCode,
    redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    if (res.status === 400 || res.status === 401) {
      authLogger.warn(
        { status: res.status },
        "OAuth authorization code rejected by Google",
      );
      throw new UnauthorizedError("Invalid or expired authorization code");
    }

    authLogger.error(
      { status: res.status },
      "OAuth provider token exchange failed",
    );
    throw new BadGatewayError("OAuth provider token exchange failed");
  }

  return res.json();
};

export const getGoogleUserData = async (
  accessToken: string,
): Promise<GoogleUserInfo> => {
  const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      authLogger.warn(
        { status: res.status },
        "Google access token rejected by userinfo endpoint",
      );
      throw new UnauthorizedError("Invalid Google access token");
    }

    authLogger.error({ status: res.status }, "Google userinfo request failed");
    throw new BadGatewayError("OAuth provider userinfo request failed");
  }

  return res.json();
};

export const rotateRefreshToken = async (refreshToken: string) => {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const storedToken = await RefreshTokenModel.findOne({
    tokenHash: refreshTokenHash,
  });

  if (!storedToken) {
    throw new UnauthorizedError("Refresh token revoked");
  }

  if (storedToken.revokedAt) {
    authLogger.warn(
      { userId: storedToken.userId },
      "Refresh token reuse detected – revoking all sessions",
    );

    await RefreshTokenModel.updateMany(
      { userId: String(storedToken.userId), revokedAt: null },
      { revokedAt: new Date() },
    );

    throw new UnauthorizedError("Refresh token reuse detected");
  }

  if (storedToken.expiresAt <= new Date()) {
    authLogger.info(
      { userId: storedToken.userId },
      "Expired refresh token used",
    );

    storedToken.revokedAt = new Date();
    await storedToken.save();
    throw new UnauthorizedError("Refresh token expired");
  }

  storedToken.revokedAt = new Date();
  await storedToken.save();

  const tokens = await generateTokenPair(String(storedToken.userId));

  authLogger.info({ userId: storedToken.userId }, "Refresh token rotated");

  return {
    ...tokens,
  };
};

export const revokeSession = async (refreshToken: string) => {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const result = await RefreshTokenModel.findOneAndUpdate(
    { tokenHash: refreshTokenHash, revokedAt: null },
    { revokedAt: new Date() },
  );

  if (result) {
    authLogger.info({ userId: result.userId }, "User logged out");
  }
};

export const revokeAllSessions = async (refreshToken: string) => {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const storedToken = await RefreshTokenModel.findOne({
    tokenHash: refreshTokenHash,
    revokedAt: null,
  });

  if (!storedToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  authLogger.info(
    { userId: storedToken.userId },
    "User logged out from all sessions",
  );

  await RefreshTokenModel.updateMany(
    { userId: storedToken.userId, revokedAt: null },
    { revokedAt: new Date() },
  );
};
