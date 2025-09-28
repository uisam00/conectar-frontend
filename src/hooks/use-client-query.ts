import { useQuery } from "@tanstack/react-query";
import { getClientById } from "@/services/api/clients-api";

export function useClientQuery(id: number) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => getClientById(id),
    enabled: !!id,
  });
}
