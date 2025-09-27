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
import useFetch from "@/services/api/use-fetch";
import { AUTH_LOGOUT_URL, AUTH_ME_URL } from "@/services/api/config";
import { HTTP_CODES } from "@/services/api/config";
import {
  getTokensInfo,
  setTokensInfo as setTokensInfoToStorage,
} from "./auth-tokens-info";

function AuthProvider(props: PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const fetchBase = useFetch();

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
        await fetchBase(AUTH_LOGOUT_URL, {
          method: "POST",
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    setTokensInfo(null);
  }, [setTokensInfo, fetchBase]);

  const loadData = useCallback(async () => {
    const tokens = getTokensInfo();

    try {
      if (tokens?.token) {
        const response = await fetchBase(AUTH_ME_URL, {
          method: "GET",
        });

        if (response.status === HTTP_CODES.UNAUTHORIZED) {
          logOut();
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      }
    } catch (error) {
      console.error("Auth load data error:", error);
    } finally {
      setIsLoaded(true);
    }
  }, [fetchBase, logOut]);

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
