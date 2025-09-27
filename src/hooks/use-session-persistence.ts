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

    // Verificar sessão quando a página ganha foco (volta de outra aba)
    const handleFocus = () => {
      checkSession();
    };

    // Verificar sessão quando a página é visível novamente
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSession();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}

