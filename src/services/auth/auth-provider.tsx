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
import { useSessionPersistence } from "@/hooks";
import { useUserQuery } from "@/hooks/use-user-query";
import { useQueryClient } from "@tanstack/react-query";

function AuthProvider(props: PropsWithChildren) {
  // Hook para gerenciar persistência de sessão
  useSessionPersistence();
  
  // Estado para controlar carregamento do logout
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // React Query para buscar dados do usuário
  const { data: user, isLoading } = useUserQuery();
  
  // QueryClient para invalidar cache
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
          console.error("Logout error:", error);
        }
      }

      // Limpar tokens
      clearTokensInfo();
      
      // Invalidar cache do React Query
      queryClient.clear();
      
      // Redirecionar para login
      window.location.href = "/sign-in";
    } finally {
      setIsLoggingOut(false);
    }
  }, [queryClient]);

  const contextValue = useMemo(
    () => ({
      isLoaded: !isLoading && !isLoggingOut, // isLoaded é true quando não está carregando nem fazendo logout
      user: user || null,
      isLoggingOut,
    }),
    [isLoading, user, isLoggingOut]
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
