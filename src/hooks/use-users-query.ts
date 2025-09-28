import { useQuery } from "@tanstack/react-query";
import { getUsers, type UsersFilters } from "@/services/api/users";

export function useUsersQuery(filters: UsersFilters = {}) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
