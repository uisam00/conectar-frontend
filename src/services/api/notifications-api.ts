import axiosInstance from "./axios-instance";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  userId?: number;
  clientId?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateNotificationDto {
  type: string;
  title: string;
  message: string;
  userId?: number;
  clientId?: number;
  metadata?: Record<string, any>;
}

export interface QueryNotificationDto {
  userId?: number;
  isRead?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface InactiveClient {
  clientId: number;
  clientName: string;
  daysInactive: number;
  totalUsers: number;
  inactiveUsers: number;
}

export interface InactiveClientsResponse {
  data: InactiveClient[];
  total: number;
}

// Buscar notificações
export async function getNotifications(
  params: QueryNotificationDto = {}
): Promise<NotificationsResponse> {
  const response = await axiosInstance.get("/v1/notifications", { params });
  return response.data;
}

// Buscar contagem de notificações não lidas
export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const response = await axiosInstance.get("/v1/notifications/unread-count");
  return response.data;
}

// Buscar notificação por ID
export async function getNotificationById(id: number): Promise<Notification> {
  const response = await axiosInstance.get(`/v1/notifications/${id}`);
  return response.data;
}

// Marcar notificação como lida
export async function markNotificationAsRead(id: number): Promise<void> {
  await axiosInstance.patch(`/v1/notifications/${id}/read`);
}

// Marcar todas as notificações como lidas
export async function markAllNotificationsAsRead(): Promise<void> {
  await axiosInstance.patch("/v1/notifications/mark-all-read");
}

// Excluir notificação
export async function deleteNotification(id: number): Promise<void> {
  await axiosInstance.delete(`/v1/notifications/${id}`);
}

// Criar notificação (apenas admin)
export async function createNotification(
  data: CreateNotificationDto
): Promise<Notification> {
  const response = await axiosInstance.post("/v1/notifications", data);
  return response.data;
}

// Buscar clientes inativos (apenas admin)
export async function getInactiveClients(): Promise<InactiveClientsResponse> {
  const response = await axiosInstance.get(
    "/v1/notifications/admin/clients-inactive"
  );
  return response.data;
}
