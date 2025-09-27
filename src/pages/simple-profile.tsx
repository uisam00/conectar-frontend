import { Container, Typography, Box, Paper } from "@mui/material";
import { useLanguage } from "@/services/i18n";
import { useAuth } from "@/services/auth";

export default function SimpleProfilePage() {
  const { t } = useLanguage("profile");
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" align="center">
          Please sign in to view your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t("title")}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Typography variant="h6">
              Welcome, {user.firstName} {user.lastName}!
            </Typography>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user.role.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {user.status.name}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
