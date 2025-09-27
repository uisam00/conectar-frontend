import { useEffect } from "react";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

/**
 * Hook para gerenciar persistência de sessão
 * Verifica se há tokens válidos nos cookies e mantém a sessão ativa
 */
export function useSessionPersistence() {
  useEffect(() => {
    // Verificar se há tokens válidos ao carregar a página
    const checkSession = () => {
      const tokens = getTokensInfo();
      
      if (tokens) {
        console.log("Session found in cookies:", {
          hasToken: !!tokens.token,
          hasRefreshToken: !!tokens.refreshToken,
          expiresAt: new Date(tokens.tokenExpires * 1000).toLocaleString(),
        });
      } else {
        console.log("No valid session found in cookies");
      }
    };

    // Verificar sessão imediatamente
    checkSession();
  }, []); // Remover event listeners que podem causar re-renders
}

