import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  People,
  Settings,
  Analytics,
  Security,
  AdminPanelSettings,
  Person,
} from "@mui/icons-material";
import PageLayout from "@/components/layout/page-layout";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const adminFeatures = [
    {
      title: "Gerenciar Clientes",
      description: "Visualize, edite e gerencie todos os clientes do sistema",
      icon: <People sx={{ fontSize: 40, color: "primary.main" }} />,
      path: "/admin/clients",
      available: true,
    },
    {
      title: "Gerenciar Usuários",
      description: "Visualize, edite e gerencie todos os usuários do sistema",
      icon: <Person sx={{ fontSize: 40, color: "secondary.main" }} />,
      path: "/admin/users",
      available: true,
    },
  ];

  return (
    <PageLayout title="Painel Administrativo">
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Gerencie todas as funcionalidades do sistema
      </Typography>

      <Grid container spacing={3}>
        {adminFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                opacity: feature.available ? 1 : 0.6,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: feature.available ? "translateY(-4px)" : "none",
                  boxShadow: feature.available ? 4 : 1,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>

                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, minHeight: 40 }}
                >
                  {feature.description}
                </Typography>

                <Button
                  variant={feature.available ? "contained" : "outlined"}
                  fullWidth
                  disabled={!feature.available}
                  onClick={() => feature.available && navigate(feature.path)}
                  sx={{ mb: 1 }}
                >
                  {feature.available ? "Acessar" : "Em Breve"}
                </Button>

                {!feature.available && (
                  <Typography variant="caption" color="text.secondary">
                    Funcionalidade em desenvolvimento
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Informações do Sistema
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Como administrador, você tem acesso completo a todas as
          funcionalidades do sistema. Use este painel para navegar entre as
          diferentes seções administrativas.
        </Typography>
      </Box>
    </PageLayout>
  );
}
