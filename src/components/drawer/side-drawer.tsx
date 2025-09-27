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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  AdminPanelSettings,
  Person,
  Close,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/services/auth";

const DRAWER_WIDTH = 280;

interface SideDrawerProps {
  open: boolean;
  onToggle: () => void;
}

export default function SideDrawer({ open, onToggle }: SideDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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
      label: "Clientes",
      icon: <AdminPanelSettings />,
      path: "/admin/clients",
      show: user?.role?.name?.toLowerCase() === "admin",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onToggle();
  };

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
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
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          Conectar
        </Typography>
        <IconButton onClick={onToggle} size="small">
          <Close />
        </IconButton>
      </Box>
      
      <Divider />
      
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
    </Drawer>
  );
}
