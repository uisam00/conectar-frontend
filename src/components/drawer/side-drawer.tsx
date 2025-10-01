import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import {
  Home,
  AdminPanelSettings,
  Person,
  Logout,
  People,
  Notifications,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useAuthActions } from "@/services/auth";
import UserAvatar from "@/components/user-avatar";

const DRAWER_WIDTH = 280;

interface SideDrawerProps {
  open: boolean;
  onToggle: () => void;
}

export default function SideDrawer({ open, onToggle }: SideDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggingOut } = useAuth();
  const { logOut } = useAuthActions();

  const menuItems = [
    {
      label: "Home",
      icon: <Home />,
      path: "/",
      show: true,
    },
    {
      label: "Notificações",
      icon: <Notifications />,
      path: "/notifications",
      show: true,
    },
    {
      label: "Perfil",
      icon: <Person />,
      path: "/profile",
      show: true,
    },
    {
      label: "Administração",
      icon: <AdminPanelSettings />,
      path: "/admin",
      show: user?.role?.name?.toLowerCase() === "admin",
    },
    {
      label: "Instituições",
      icon: <AdminPanelSettings />,
      path: "/admin/clients",
      show: user?.role?.name?.toLowerCase() === "admin",
    },
    {
      label: "Usuários",
      icon: <People />,
      path: "/admin/users",
      show: user?.role?.name?.toLowerCase() === "admin",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onToggle();
  };

  const handleLogout = async () => {
    await logOut();
    navigate("/sign-in");
    onToggle();
  };

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    // Para evitar que /admin seja ativo quando estamos em /admin/clients
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onToggle}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", height: "100%" }}>
        <List sx={{ pt: 2 }}>
          {menuItems
            .filter((item) => item.show)
            .map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActiveRoute(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActiveRoute(item.path) ? "white" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>

        {/* Seção do usuário fixa na parte inferior */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            zIndex: 1,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                borderRadius: 1,
                p: 1,
                transition: "background-color 0.2s",
              }}
              onClick={() => handleNavigation("/profile")}
            >
              <UserAvatar size={40} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email}
                </Typography>
              </Box>
              {/* Ícone de sair para mobile */}
              <IconButton
                onClick={handleLogout}
                disabled={isLoggingOut}
                sx={{
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "error.light",
                    color: "error.dark",
                  },
                }}
                size="small"
              >
                {isLoggingOut ? (
                  <CircularProgress size={20} color="error" />
                ) : (
                  <Logout sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
