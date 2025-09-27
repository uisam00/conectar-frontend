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
    console.log("🚪 Iniciando logout...");
    setIsLoggingOut(true);

    try {
      const tokens = getTokensInfo();
      console.log("🔑 Tokens encontrados:", { hasToken: !!tokens?.token });

      if (tokens?.token) {
        try {
          console.log(
            "📤 Enviando requisição de logout para:",
            AUTH_LOGOUT_URL
          );
          await axiosInstance.post(AUTH_LOGOUT_URL);
          console.log("✅ Logout no servidor realizado com sucesso");
        } catch (error) {
          console.error("❌ Erro no logout do servidor:", error);
        }
      } else {
        console.log("⚠️ Sem token, pulando logout no servidor");
      }

      console.log("🧹 Limpando tokens...");
      clearTokensInfo();

      console.log("🗑️ Limpando cache do React Query...");
      queryClient.clear();

      // Pequeno delay para mostrar "Saindo..." antes do redirecionamento
      console.log("⏳ Aguardando antes do redirecionamento...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Não redireciona aqui - deixa para o componente que chama o logout
      console.log(
        "✅ Logout concluído - redirecionamento será feito pelo componente"
      );
    } catch (error) {
      console.error("❌ Erro durante logout:", error);
      // Mesmo com erro, limpar tokens
      clearTokensInfo();
      queryClient.clear();
      console.log(
        "✅ Logout com erro concluído - redirecionamento será feito pelo componente"
      );
    }
  }, [queryClient]);

  const contextValue = useMemo(
    () => ({
      isLoaded: !isLoading && !isLoggingOut, // isLoaded é false durante logout para mostrar loading
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
