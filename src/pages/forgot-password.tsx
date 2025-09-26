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
import useFetch from '@/services/api/use-fetch';
import { AUTH_FORGOT_PASSWORD_URL } from '@/services/api/config';
import { useSnackbar, useErrorHandler } from '@/hooks';

export default function ForgotPasswordPage() {
  const { t } = useLanguage('forgot-password');
  const fetchBase = useFetch();
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const { handleApiError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchBase(AUTH_FORGOT_PASSWORD_URL, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showSuccess(t('messages.success'));
        navigate('/sign-in');
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

          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            {t('description')}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              <MuiLink component={Link} to="/sign-in" variant="body2">
                {t('actions.backToSignIn')}
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
