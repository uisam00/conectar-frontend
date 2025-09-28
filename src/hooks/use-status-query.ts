import { useQuery } from "@tanstack/react-query";
import { getStatuses } from "@/services/api/status-api";

export function useStatusQuery() {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
