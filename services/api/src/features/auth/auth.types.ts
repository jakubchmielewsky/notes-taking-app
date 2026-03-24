export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: "Bearer";
  id_token: string;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  picture?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
}

export interface JwtPayload {
  sub: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
