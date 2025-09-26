import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useAuthActions } from '@/services/auth';
import { useLanguage } from '@/services/i18n';
import SwitchThemeButton from './switch-theme-button';

export default function ResponsiveAppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const { t } = useLanguage('common');
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logOut();
    navigate('/sign-in');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('app-name')}
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SwitchThemeButton />
          
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/users">
                {t('navigation.users')}
              </Button>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user.photo ? (
                  <Avatar src={user.photo.path} alt={user.firstName} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>
                  {t('navigation.profile')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  {t('navigation.logout')}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/sign-in">
              {t('navigation.signIn')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
