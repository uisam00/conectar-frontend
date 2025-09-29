import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  Typography,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ArrowBack, Edit, Delete, Person, Business } from "@mui/icons-material";
import { useLanguage } from "@/services/i18n";
import { useUserQuery } from "@/hooks/use-user-query";
import { useDeleteUser } from "@/hooks/use-delete-user";
import AdminPageLayout from "@/components/layout/admin-page-layout";
import { Helmet } from "react-helmet";

export default function UserViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage("user-view");
  const userId = id ? parseInt(id) : 0;

  const { data: user, isLoading, error } = useUserQuery(userId);
  const deleteUserMutation = useDeleteUser();

  const handleEdit = () => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm(t("confirmDelete.message"))) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleBack = () => {
    navigate("/admin/users");
  };

  if (isLoading) {
    return (
      <AdminPageLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </AdminPageLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminPageLayout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Usuário não encontrado
          </Typography>
        </Box>
      </AdminPageLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Visualizar Usuário | Conéctar</title>
      </Helmet>
      <AdminPageLayout>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: 1200,
            mx: "auto",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3,
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: "primary.main",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              Visualizar Usuário
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                fullWidth={true}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
                fullWidth={true}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDelete}
                disabled={deleteUserMutation.isPending}
                fullWidth={true}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {deleteUserMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : (
                  "Excluir"
                )}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Informações do Usuário */}
            <Card sx={{ flex: 1, minWidth: 0 }}>
              <CardHeader
                avatar={
                  <Avatar src={user.photo?.path} sx={{ width: 60, height: 60 }}>
                    <Person />
                  </Avatar>
                }
                title={`${user.firstName} ${user.lastName}`}
                subheader={user.email}
                action={
                  <Box
                    sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                  >
                    <Chip
                      label={
                        user.status?.name === "active" ? "Ativo" : "Inativo"
                      }
                      color={
                        user.status?.name === "active" ? "success" : "error"
                      }
                      size="small"
                    />
                    <Chip
                      label={user.role?.name || "N/A"}
                      color="primary"
                      size="small"
                    />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Nome:</strong> {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Role do Sistema:</strong> {user.role?.name || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Status:</strong> {user.status?.name || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Criado em:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Atualizado em:</strong>{" "}
                  {new Date(user.updatedAt).toLocaleDateString("pt-BR")}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Clientes do Usuário */}
          {user.clients && user.clients.length > 0 && (
            <Card>
              <CardHeader
                title="Instituições do Usuário"
                subheader={`${user.clients.length} instituição(ões) associada(s)`}
                avatar={<Business />}
              />
              <CardContent>
                <TableContainer
                  component={Paper}
                  sx={{
                    overflowX: "auto",
                    "& .MuiTable-root": {
                      minWidth: 300,
                    },
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Instituição
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>CNPJ</TableCell>
                        <TableCell>Role na Instituição</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {user.clients.map((client: any) => (
                        <TableRow key={client.id}>
                          <TableCell
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Avatar sx={{ width: 32, height: 32 }}>
                                <Business />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {client.razaoSocial}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {client.nomeComercial}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            {client.cnpj}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            <Chip
                              label={
                                client.clientRole?.name ||
                                `Role ID: ${client.clientRoleId}`
                              }
                              color="secondary"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      </AdminPageLayout>
    </>
  );
}
