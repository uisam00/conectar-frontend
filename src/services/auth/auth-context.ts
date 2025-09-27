import { createContext } from "react";
import type { User } from "@/types/api";

export interface TokensInfo {
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface AuthContextType {
  isLoaded: boolean;
  user: User | null;
  isLoggingOut: boolean;
}

export interface AuthActionsContextType {
  logOut: () => Promise<void>;
}

export interface AuthTokensContextType {
  setTokensInfo: (tokensInfo: TokensInfo | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  user: null,
  isLoggingOut: false,
});

export const AuthActionsContext = createContext<AuthActionsContextType>({
  logOut: async () => {},
});

export const AuthTokensContext = createContext<AuthTokensContextType>({
  setTokensInfo: () => {},
});
