import { Typography, Card, CardContent, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth";
import PageLayout from "@/components/layout/page-layout";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoToAdmin = () => {
    if (user?.role?.name?.toLowerCase() === "admin") {
      navigate("/admin");
    }
  };

  return (
    <PageLayout title={`Bem-vindo, ${user?.firstName}!`} showBreadcrumb={false}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Meu Perfil
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Gerencie suas informações pessoais e configurações de conta.
                </Typography>
                <Button variant="outlined" onClick={() => navigate("/profile")}>
                  Acessar Perfil
                </Button>
              </CardContent>
            </Card>
          </Box>

          {user?.role?.name?.toLowerCase() === "admin" && (
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Painel Administrativo
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Acesse todas as funcionalidades administrativas do sistema.
                  </Typography>
                  <Button variant="contained" onClick={handleGoToAdmin}>
                    Acessar Admin
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Informações da Conta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {user?.email}
              <br />
              <strong>Role:</strong> {user?.role?.name}
              <br />
              <strong>Status:</strong> {user?.status?.name}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </PageLayout>
  );
}
