import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/services/api/users";

export function useUserQuery(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}
