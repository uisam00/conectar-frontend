import { createContext } from 'react';
import type { User } from '@/types/api';

export interface TokensInfo {
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface AuthContextType {
  isLoaded: boolean;
  user: User | null;
}

export interface AuthActionsContextType {
  setUser: (user: User | null) => void;
  logOut: () => Promise<void>;
}

export interface AuthTokensContextType {
  setTokensInfo: (tokensInfo: TokensInfo | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  user: null,
});

export const AuthActionsContext = createContext<AuthActionsContextType>({
  setUser: () => {},
  logOut: async () => {},
});

export const AuthTokensContext = createContext<AuthTokensContextType>({
  setTokensInfo: () => {},
});
