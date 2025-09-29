import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getClients,
} from "@/services/api/clients-api";

export function useClientsPaginatedQuery(
  enabled: boolean = true
) {
  const { data, isLoading, error, hasNextPage,isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ["clients-paginated"],
    queryFn: ({ pageParam = 1 }) => getClients({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / 10);
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
  
  return {
    data: data?.pages?.flatMap((page) => page.data) || [],
    total: data?.pages[0]?.total || 0,
    loading: isLoading,
    error: error?.message || null,
    hasNextPage,
    isFetchingNextPage,    
    refetch,
    fetchNextPage
  };
}
