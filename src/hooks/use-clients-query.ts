import { useQuery } from "@tanstack/react-query";
import {
  getClients,
  type ClientsFilters,
  type ClientsResponse,
} from "@/services/api/clients-api";

export function useClients(
  filters: ClientsFilters = {},
  enabled: boolean = true
) {
  const { data, isLoading, error, refetch } = useQuery<ClientsResponse, Error>({
    queryKey: ["clients", filters],
    queryFn: () => getClients(filters),
    enabled,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });
  return {
    clients: data?.data || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
