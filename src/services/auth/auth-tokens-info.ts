import Cookies from "js-cookie";
import type { TokensInfo } from "./auth-context";

const TOKEN_KEY = "auth-token";
const REFRESH_TOKEN_KEY = "auth-refresh-token";
const TOKEN_EXPIRES_KEY = "auth-token-expires";

export function getTokensInfo(): TokensInfo | null {
  const token = Cookies.get(TOKEN_KEY);
  const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
  const tokenExpires = Cookies.get(TOKEN_EXPIRES_KEY);

  if (!token || !refreshToken || !tokenExpires) {
    return null;
  }

  const expiresTimestamp = parseInt(tokenExpires, 10);
  
  // Check if token is expired
  if (Date.now() >= expiresTimestamp * 1000) {
    // Clear expired tokens
    setTokensInfo(null);
    return null;
  }

  return {
    token,
    refreshToken,
    tokenExpires: expiresTimestamp,
  };
}

export function setTokensInfo(tokensInfo: TokensInfo | null): void {
  if (!tokensInfo) {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(TOKEN_EXPIRES_KEY);
    return;
  }

  // Set cookies with proper configuration
  const expires = new Date(tokensInfo.tokenExpires * 1000);
  const cookieOptions = {
    expires,
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    sameSite: 'lax' as const, // CSRF protection
    path: '/', // Available for entire site
  };

  Cookies.set(TOKEN_KEY, tokensInfo.token, cookieOptions);
  Cookies.set(REFRESH_TOKEN_KEY, tokensInfo.refreshToken, cookieOptions);
  Cookies.set(TOKEN_EXPIRES_KEY, tokensInfo.tokenExpires.toString(), cookieOptions);
}

export function clearTokensInfo(): void {
  Cookies.remove(TOKEN_KEY, { path: '/' });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
  Cookies.remove(TOKEN_EXPIRES_KEY, { path: '/' });
}
