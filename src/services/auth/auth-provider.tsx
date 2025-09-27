"use client";

import type { User } from "@/types/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  AuthActionsContext,
  AuthContext,
  AuthTokensContext,
  type TokensInfo,
} from "./auth-context";
import axiosInstance from "@/services/api/axios-instance";
import { AUTH_LOGOUT_URL, AUTH_ME_URL } from "@/services/api/config";
import { HTTP_CODES } from "@/services/api/config";
import {
  getTokensInfo,
  setTokensInfo as setTokensInfoToStorage,
  clearTokensInfo,
} from "./auth-tokens-info";
import { useSessionPersistence } from "@/hooks";

function AuthProvider(props: PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Hook para gerenciar persistência de sessão
  useSessionPersistence();

  const setTokensInfo = useCallback((tokensInfo: TokensInfo | null) => {
    setTokensInfoToStorage(tokensInfo);

    if (!tokensInfo) {
      setUser(null);
    }
  }, []);

  const logOut = useCallback(async () => {
    const tokens = getTokensInfo();

    if (tokens?.token) {
      try {
        await axiosInstance.post(AUTH_LOGOUT_URL);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    // Clear tokens and user data
    clearTokensInfo();
    setUser(null);
  }, []);

  const loadData = useCallback(async () => {
    const tokens = getTokensInfo();

    try {
      if (tokens?.token) {
        const response = await axiosInstance.get(AUTH_ME_URL);

        if (response.status === HTTP_CODES.UNAUTHORIZED) {
          logOut();
          return;
        }

        setUser(response.data);
      }
    } catch (error) {
      console.error("Auth load data error:", error);
    } finally {
      setIsLoaded(true);
    }
  }, [logOut]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const contextValue = useMemo(
    () => ({
      isLoaded,
      user,
    }),
    [isLoaded, user]
  );

  const contextActionsValue = useMemo(
    () => ({
      setUser,
      logOut,
    }),
    [logOut]
  );

  const contextTokensValue = useMemo(
    () => ({
      setTokensInfo,
    }),
    [setTokensInfo]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AuthActionsContext.Provider value={contextActionsValue}>
        <AuthTokensContext.Provider value={contextTokensValue}>
          {props.children}
        </AuthTokensContext.Provider>
      </AuthActionsContext.Provider>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
