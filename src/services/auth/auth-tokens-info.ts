import Cookies from 'js-cookie';
import type { TokensInfo } from './auth-context';

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';
const TOKEN_EXPIRES_KEY = 'auth-token-expires';

export function getTokensInfo(): TokensInfo | null {
  const token = Cookies.get(TOKEN_KEY);
  const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
  const tokenExpires = Cookies.get(TOKEN_EXPIRES_KEY);

  if (!token || !refreshToken || !tokenExpires) {
    return null;
  }

  return {
    token,
    refreshToken,
    tokenExpires: parseInt(tokenExpires, 10),
  };
}

export function setTokensInfo(tokensInfo: TokensInfo | null): void {
  if (!tokensInfo) {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(TOKEN_EXPIRES_KEY);
    return;
  }

  // Set cookies with expiration
  const expires = new Date(tokensInfo.tokenExpires * 1000);
  
  Cookies.set(TOKEN_KEY, tokensInfo.token, { expires });
  Cookies.set(REFRESH_TOKEN_KEY, tokensInfo.refreshToken, { expires });
  Cookies.set(TOKEN_EXPIRES_KEY, tokensInfo.tokenExpires.toString(), { expires });
}
