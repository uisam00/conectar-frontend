import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api/axios-instance";
import { AUTH_ME_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import type { User } from "@/types/api";

export function useUserQuery() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User> => {
      const response = await axiosInstance.get(AUTH_ME_URL);
      return response.data;
    },
    enabled: !!getTokensInfo()?.token, 
    staleTime: 5 * 60 * 1000, 
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
