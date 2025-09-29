"use client";

import { useCallback, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  AuthActionsContext,
  AuthContext,
  AuthTokensContext,
  type TokensInfo,
} from "./auth-context";
import axiosInstance from "@/services/api/axios-instance";
import { AUTH_LOGOUT_URL } from "@/services/api/config";
import {
  getTokensInfo,
  setTokensInfo as setTokensInfoToStorage,
  clearTokensInfo,
} from "./auth-tokens-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useQueryClient } from "@tanstack/react-query";

function AuthProvider(props: PropsWithChildren) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: user, isLoading, error } = useCurrentUser();
  const queryClient = useQueryClient();

  const setTokensInfo = useCallback((tokensInfo: TokensInfo | null) => {
    setTokensInfoToStorage(tokensInfo);
  }, []);

  const logOut = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      const tokens = getTokensInfo();

      if (tokens?.token) {
        try {
          await axiosInstance.post(AUTH_LOGOUT_URL);
        } catch (error) {
          // Ignore server logout errors
        }
      }

      clearTokensInfo();
      queryClient.clear();

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      clearTokensInfo();
      queryClient.clear();
    } finally {
      setIsLoggingOut(false);
    }
  }, [queryClient]);

  const contextValue = useMemo(
    () => ({
      isLoaded: !isLoading && !isLoggingOut,
      user: user || null,
      isLoggingOut,
      error,
    }),
    [isLoading, user, isLoggingOut, error]
  );

  const contextActionsValue = useMemo(
    () => ({
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
