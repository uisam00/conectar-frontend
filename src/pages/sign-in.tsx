import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Link as MuiLink,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/services/i18n';
import { useAuthActions, useAuthTokens } from '@/services/auth';
import useFetch from '@/services/api/use-fetch';
import { AUTH_LOGIN_URL } from '@/services/api/config';
import { useErrorHandler } from '@/hooks';

export default function SignInPage() {
  const { t } = useLanguage('sign-in');
  const { setTokensInfo } = useAuthTokens();
  const { setUser } = useAuthActions();
  const fetchBase = useFetch();
  const navigate = useNavigate();
  const { handleApiError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchBase(AUTH_LOGIN_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setTokensInfo({
          token: result.token,
          refreshToken: result.refreshToken,
          tokenExpires: result.tokenExpires,
        });
        setUser(result.user);
        navigate('/');
      } else {
        const errorData = await response.json();
        const errors = errorData.errors || errorData;
        handleApiError(errors);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {t('title')}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              name="email"
              label={t('inputs.email.label')}
              type="email"
              autoComplete="email"
              autoFocus
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              name="password"
              label={t('inputs.password.label')}
              type="password"
              autoComplete="current-password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? t('loading') : t('actions.submit')}
            </Button>

            <Box textAlign="center">
              <MuiLink component={Link} to="/forgot-password" variant="body2">
                {t('actions.forgotPassword')}
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
