import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  deleteNotification,
  type QueryNotificationDto,
} from "@/services/api/notifications-api";

export function useNotifications(params: QueryNotificationDto = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useInfiniteNotifications(params: QueryNotificationDto = {}) {
  return useInfiniteQuery({
    queryKey: ["notifications", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      getNotifications({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage: any, allPages) => {
      const totalPages = Math.ceil(lastPage.total / (params.limit || 10));
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// Hook para obter contagem de não lidas diretamente das notificações
export function useUnreadCountFromNotifications(
  params: QueryNotificationDto = {}
) {
  const { data: notificationsData } = useNotifications(params);
  return {
    data: { count: notificationsData?.unreadCount || 0 },
    isLoading: false,
    error: null,
  };
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate and refetch notifications and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // Invalidate and refetch notifications and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
