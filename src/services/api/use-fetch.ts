import { useCallback } from "react";
import { getTokensInfo, setTokensInfo } from "../auth/auth-tokens-info";
import { API_URL, AUTH_REFRESH_URL, HTTP_CODES } from "./config";

export default function useFetch() {
  return useCallback(async (url: string, options: RequestInit = {}) => {
    const tokens = getTokensInfo();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type for JSON requests, not for FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (tokens?.token) {
      headers.Authorization = `Bearer ${tokens.token}`;
    }

    // Add language header if available
    const language = localStorage.getItem("i18nextLng") || "en";
    headers["x-custom-lang"] = language;

    const response = await fetch(
      url.startsWith("http") ? url : `${API_URL}${url}`,
      {
        ...options,
        headers,
      }
    );

    // Se a resposta for 401 (Unauthorized) e temos refresh token, tentar renovar
    if (response.status === HTTP_CODES.UNAUTHORIZED && tokens?.refreshToken && url !== AUTH_REFRESH_URL) {
      try {
        console.log("Token expirado, tentando renovar com refresh token...");
        
        const refreshResponse = await fetch(AUTH_REFRESH_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${tokens.refreshToken}`,
            "Content-Type": "application/json",
            "x-custom-lang": language,
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          console.log("Refresh token bem-sucedido, salvando novos tokens...");
          
          // Salvar novos tokens
          setTokensInfo({
            token: refreshData.token,
            refreshToken: refreshData.refreshToken,
            tokenExpires: refreshData.tokenExpires,
          });

          // Refazer a requisição original com o novo token
          const newHeaders = {
            ...headers,
            "Authorization": `Bearer ${refreshData.token}`,
          };

          return await fetch(
            url.startsWith("http") ? url : `${API_URL}${url}`,
            {
              ...options,
              headers: newHeaders,
            }
          );
        } else {
          console.log("Refresh token falhou, fazendo logout...");
          // Se o refresh token também falhou, limpar tokens
          setTokensInfo(null);
          // Redirecionar para login ou mostrar erro
          window.location.href = "/sign-in";
        }
      } catch (error) {
        console.error("Erro ao renovar token:", error);
        setTokensInfo(null);
        window.location.href = "/sign-in";
      }
    }

    return response;
  }, []);
}
