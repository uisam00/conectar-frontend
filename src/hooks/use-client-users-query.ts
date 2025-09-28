import { useQuery } from "@tanstack/react-query";
import { getClientUsers } from "@/services/api/clients-api";

interface ClientUsersFilters {
  search?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: number;
  statusId?: number;
  systemRoleId?: number;
  clientRoleId?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export function useClientUsersQuery(
  clientId: number, 
  filters: ClientUsersFilters = {}
) {
  return useQuery({
    queryKey: ["client-users", clientId, filters],
    queryFn: () => getClientUsers(clientId, filters),
    enabled: !!clientId,
  });
}
