import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  FormControl,
  Select,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Help, Notifications, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useAuthActions } from "@/services/auth";
import { useLanguage } from "@/services/i18n";
import SideDrawer from "@/components/drawer/side-drawer";
import useDrawer from "@/hooks/use-drawer";
import { useClient } from "@/hooks/use-client";
import UserAvatar from "@/components/user-avatar";

export default function ResponsiveAppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const { t } = useLanguage("common");
  const navigate = useNavigate();
  const { isOpen, toggleDrawer, clearDrawerState } = useDrawer();
  const { selectedClient, setSelectedClient, userClients, isLoading } =
    useClient();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logOut();
    clearDrawerState(); // Limpar estado do drawer no logout
    navigate("/sign-in");
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleClientChange = (event: any) => {
    const clientId = event.target.value;
    const client = userClients.find((c) => c.id === clientId);
    setSelectedClient(client || null);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "primary.main",
          boxShadow: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
          >
            {user && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Link to="/" style={{ textDecoration: "none" }}>
              <img
                src="/logo.png"
                alt="Conectar"
                style={{ height: "32px", width: "auto", cursor: "pointer" }}
              />
            </Link>

            {/* Seletor de Instituição para usuários normais */}
            {user &&
              user.role?.name?.toLowerCase() !== "admin" &&
              userClients.length > 0 && (
                <Box sx={{ minWidth: 200, ml: 2 }}>
                  <FormControl fullWidth size="small">
                    {isLoading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          py: 1,
                        }}
                      >
                        <CircularProgress size={20} color="inherit" />
                      </Box>
                    ) : (
                      <Select
                        value={selectedClient?.id || ""}
                        onChange={handleClientChange}
                        displayEmpty
                        sx={{
                          color: "white",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "white",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          <Typography variant="body2" color="text.secondary">
                            Selecionar Instituição
                          </Typography>
                        </MenuItem>
                        {userClients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            <Typography variant="body2">
                              {client.razaoSocial}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                </Box>
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
                  sx={{ color: "white" }}
                >
                  <UserAvatar
                    size={24}
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                    }}
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
      {user && <SideDrawer open={isOpen} onToggle={toggleDrawer} />}
    </>
  );
}
