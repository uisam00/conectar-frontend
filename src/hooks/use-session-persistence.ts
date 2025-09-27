import { useEffect } from "react";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

export function useSessionPersistence() {
  useEffect(() => {
    const checkSession = () => {
      const tokens = getTokensInfo();
    };

    checkSession();
  }, []);
}

