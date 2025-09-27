import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import {
  Home,
  AdminPanelSettings,
  Person,
  Close,
  Logout,
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
  const { user } = useAuth();
  const { logOut } = useAuthActions();

  const menuItems = [
    {
      label: "Home",
      icon: <Home />,
      path: "/",
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
          top: 64, // Altura do AppBar
          height: "calc(100vh - 64px)", // Altura total menos a altura do AppBar
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <List sx={{ pt: 2, flex: 1 }}>
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

        {/* Seção do usuário no final */}
        <Box sx={{ mt: "auto" }}>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
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
            </Box>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Logout sx={{ fontSize: 16 }} />}
              onClick={handleLogout}
              size="small"
            >
              Sair
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
