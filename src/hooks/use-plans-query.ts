import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/services/api/plans-api";

export function usePlansQuery() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
