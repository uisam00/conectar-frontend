import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api/axios-instance";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const language = localStorage.getItem("i18nextLng") || "en";
        const response = await axiosInstance.get("/v1/auth/me", {
          headers: {
            "x-custom-lang": language,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
