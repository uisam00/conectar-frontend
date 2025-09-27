import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Help, Notifications } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useAuthActions } from "@/services/auth";
import { useLanguage } from "@/services/i18n";

export default function ResponsiveAppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const { t } = useLanguage("common");
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logOut();
    navigate("/sign-in");
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#19AF78",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
        >
          <img
            src="/logo.png"
            alt="Conectar"
            style={{ height: "32px", width: "auto" }}
          />
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/clients"
              sx={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 1,
                px: 2,
                py: 1,
              }}
            >
              Clientes
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user ? (
            <>
              <IconButton sx={{ color: "white" }}>
                <Help />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <Notifications />
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ color: "white", p: 0 }}
              >
                <Avatar
                  alt={`${user.firstName} ${user.lastName}`}
                  src={user.photo?.path}
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>
                  {t("navigation.profile")}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  {t("navigation.logout")}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/sign-in"
              sx={{ color: "white" }}
            >
              {t("navigation.signIn")}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
