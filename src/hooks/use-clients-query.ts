import { useQuery } from "@tanstack/react-query";
import { getClients, type ClientsFilters, type Client, type ClientsResponse } from "@/services/api/clients-api";

export function useClientsQuery(filters: ClientsFilters = {}, enabled: boolean = true) {
  return useQuery<ClientsResponse, Error>({
    queryKey: ["clients", filters],
    queryFn: () => getClients(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useClients(filters: ClientsFilters = {}, enabled: boolean = true) {
  const { data, isLoading, error, refetch } = useClientsQuery(filters, enabled);

  return {
    clients: data?.data || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
