import { useQuery } from "@tanstack/react-query";
import { getClientRoles } from "@/services/api/client-roles";

export function useClientRolesQuery() {
  return useQuery({
    queryKey: ["client-roles"],
    queryFn: getClientRoles,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
