import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import {
  useInfiniteNotifications,
  useMarkAsRead,
  useDeleteNotification,
} from "@/hooks/use-notifications";
import { useAuth } from "@/services/auth";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<
    number | null
  >(null);

  const {
    data: infiniteData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNotifications({
    userId: user?.role?.name?.toLowerCase() === "admin" ? undefined : user?.id,
    limit: 10, // 10 notificações por página
  });

  // Flatten all pages into a single array
  const notifications =
    infiniteData?.pages.flatMap((page: any) => page.data) || [];

  const markAsReadMutation = useMarkAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    notificationId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
      handleMenuClose();
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotificationMutation.mutateAsync(notificationId);
      handleMenuClose();
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "client_inactive":
        return <WarningIcon color="warning" />;
      case "system":
        return <InfoIcon color="info" />;
      default:
        return <NotificationsIcon color="primary" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "client_inactive":
        return "warning";
      case "system":
        return "info";
      default:
        return "primary";
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "client_inactive":
        return "Cliente Inativo";
      case "system":
        return "Sistema";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Erro ao carregar notificações. Tente novamente.
        </Alert>
      </Box>
    );
  }

  // Usar a variável notifications já ordenada
  const total = (infiniteData?.pages[0] as any)?.total || 0;

  return (
    <>
      {" "}
      <Helmet>
        <title>Administração | Conéctar</title>
      </Helmet>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Notificações
          </Typography>
        </Box>

        {total === 0 ? (
          <Card>
            <CardContent>
              <Box textAlign="center" py={4}>
                <NotificationsIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Nenhuma notificação encontrada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Você não possui notificações no momento.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                sx={{
                  mb: 2,
                  opacity: notification.isRead ? 0.7 : 1,
                  backgroundColor: notification.isRead
                    ? "background.default"
                    : "background.paper",
                  border: notification.isRead ? "none" : "1px solid",
                  borderColor: "primary.main",
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="flex-start" flex={1}>
                      <Box mr={2} mt={0.5}>
                        {getNotificationIcon(notification.type)}
                      </Box>
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography variant="h6" component="h3">
                            {notification.title}
                          </Typography>
                          {!notification.isRead && (
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: "primary.main",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Chip
                            label={getNotificationTypeLabel(notification.type)}
                            size="small"
                            color={
                              getNotificationColor(notification.type) as any
                            }
                            variant="outlined"
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                              locale: ptBR,
                            }
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {!notification.isRead && (
                        <Tooltip title="Marcar como lida">
                          <IconButton
                            size="small"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            <CheckCircleIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, notification.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {selectedNotification && (
                <>
                  {!notifications.find((n) => n.id === selectedNotification)
                    ?.isRead && (
                    <MenuItem
                      onClick={() => handleMarkAsRead(selectedNotification)}
                      disabled={markAsReadMutation.isPending}
                    >
                      <ListItemIcon>
                        <CheckCircleIcon />
                      </ListItemIcon>
                      <ListItemText>Marcar como lida</ListItemText>
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => handleDelete(selectedNotification)}
                    disabled={deleteNotificationMutation.isPending}
                    sx={{ color: "error.main" }}
                  >
                    <ListItemIcon>
                      <DeleteIcon color="error" />
                    </ListItemIcon>
                    <ListItemText>Excluir</ListItemText>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        )}

        {/* Botão de carregar mais */}
        {hasNextPage && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="outlined"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              startIcon={
                isFetchingNextPage ? <CircularProgress size={20} /> : null
              }
            >
              {isFetchingNextPage
                ? "Carregando..."
                : "Carregar mais notificações"}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}
