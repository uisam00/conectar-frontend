import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Tooltip,
  Popover,
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import {
  useUnreadCount,
  useNotifications,
  useMarkAsRead,
  useUnreadCountFromNotifications,
} from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function NotificationIcon() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: notificationsData, isLoading: isLoadingNotifications } =
    useNotifications({
      limit: 5, // Mostrar apenas as 5 mais recentes
    });

  const markAsReadMutation = useMarkAsRead();

  // Usar a contagem de não lidas diretamente da resposta das notificações
  const unreadCount = notificationsData?.unreadCount || 0;
  const notifications = (notificationsData?.data || []).sort((a, b) => {
    // Não lidas primeiro, depois por data (mais recente primeiro)
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewAll = () => {
    navigate("/notifications");
    handleClose();
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "client_inactive":
        return <WarningIcon color="warning" fontSize="small" />;
      case "system":
        return <InfoIcon color="info" fontSize="small" />;
      default:
        return <NotificationsIcon color="primary" fontSize="small" />;
    }
  };

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon sx={{ color: "white" }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            mt: 1,
          },
        }}
      >
        <Box p={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Notificações</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {isLoadingNotifications ? (
            <Box display="flex" justifyContent="center" py={2}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box textAlign="center" py={2}>
              <NotificationsIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Nenhuma notificação
              </Typography>
            </Box>
          ) : (
            <Box>
              {notifications.map((notification) => (
                <Box
                  key={notification.id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: notification.isRead
                      ? "background.default"
                      : "action.hover",
                    border: notification.isRead ? "none" : "1px solid",
                    borderColor: notification.isRead
                      ? "transparent"
                      : "primary.light",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  }}
                  onClick={() =>
                    !notification.isRead && handleMarkAsRead(notification.id)
                  }
                >
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <Box mt={0.5}>{getNotificationIcon(notification.type)}</Box>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={notification.isRead ? "normal" : "bold"}
                        >
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
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </Typography>
                    </Box>
                    {!notification.isRead && (
                      <Box mt={0.5}>
                        <Tooltip title="Marcar como lida" arrow>
                          <CheckCircleIcon
                            color="primary"
                            fontSize="small"
                            sx={{ cursor: "pointer" }}
                          />
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                onClick={handleViewAll}
                sx={{ mt: 1 }}
              >
                Ver todas as notificações
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}
