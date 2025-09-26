import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Link as MuiLink,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/services/i18n';
import useFetch from '@/services/api/use-fetch';
import { AUTH_REGISTER_URL } from '@/services/api/config';
import { useSnackbar, useErrorHandler } from '@/hooks';

export default function SignUpPage() {
  const { t } = useLanguage('sign-up');
  const fetchBase = useFetch();
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const { handleApiError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchBase(AUTH_REGISTER_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccess('Registration successful! Please check your email to confirm your account.');
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

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              name="firstName"
              label={t('inputs.firstName.label')}
              autoComplete="given-name"
              autoFocus
              fullWidth
              margin="normal"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <TextField
              name="lastName"
              label={t('inputs.lastName.label')}
              autoComplete="family-name"
              fullWidth
              margin="normal"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <TextField
              name="email"
              label={t('inputs.email.label')}
              type="email"
              autoComplete="email"
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
              autoComplete="new-password"
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

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('or')}
              </Typography>
            </Divider>

            <Box textAlign="center">
              <MuiLink component={Link} to="/sign-in" variant="body2">
                {t('actions.accountAlreadyExists')}
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
