import { Container, Typography, Box, Paper } from '@mui/material';
import { useLanguage } from '@/services/i18n';
import { useAuth } from '@/services/auth';

export default function HomePage() {
  const { t } = useLanguage('home');
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            {t('title')}
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            {t('description')}
          </Typography>

          {user && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Welcome, {user.firstName} {user.lastName}!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {user.role.name}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
