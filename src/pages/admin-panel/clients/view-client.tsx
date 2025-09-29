import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Button,
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
import { ArrowBack, Edit, Delete, Business, Person } from "@mui/icons-material";
import { useLanguage } from "@/services/i18n";
import { useClientQuery } from "@/hooks/use-client-query";
import { useClientUsersQuery } from "@/hooks/use-client-users-query";
import { useDeleteClient } from "@/hooks/use-delete-client";
import ClientForm from "@/components/client-form";
import AdminPageLayout from "@/components/layout/admin-page-layout";

export default function ViewClientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage("clients");
  const clientId = id ? parseInt(id) : 0;

  const { data: client, isLoading, error } = useClientQuery(clientId);
  const { data: clientUsers, isLoading: isLoadingUsers, error: usersError } = useClientUsersQuery(clientId);
  const deleteClientMutation = useDeleteClient();

  const handleEdit = () => {
    navigate(`/admin/clients/${clientId}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteClientMutation.mutate(clientId);
    }
  };

  const handleBack = () => {
    navigate("/admin/clients");
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

  if (error || !client) {
    return (
      <AdminPageLayout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Cliente não encontrado
          </Typography>
        </Box>
      </AdminPageLayout>
    );
  }

  // Dados dos usuários vêm da API através do hook useClientUsersQuery

  return (
    <AdminPageLayout>
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "primary.main" }}
          >
            Visualizar Cliente
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              disabled={deleteClientMutation.isPending}
            >
              {deleteClientMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                "Excluir"
              )}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          {/* Informações do Cliente */}
          <Card sx={{ flex: 1 }}>
            <CardHeader
              avatar={
                <Avatar src={client.photo?.path} sx={{ width: 60, height: 60 }}>
                  <Business />
                </Avatar>
              }
              title={client.razaoSocial}
              subheader={client.nomeComercial}
              action={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label={client.statusId === 1 ? "Ativo" : "Inativo"}
                    color={client.statusId === 1 ? "success" : "error"}
                    size="small"
                  />
                  <Chip
                    label={`Plano ${client.planId}`}
                    color="primary"
                    size="small"
                  />
                </Box>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>CNPJ:</strong> {client.cnpj}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Criado em:</strong>{" "}
                {new Date(client.createdAt).toLocaleDateString("pt-BR")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Atualizado em:</strong>{" "}
                {new Date(client.updatedAt).toLocaleDateString("pt-BR")}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Usuários do Cliente */}
        <Card>
          <CardHeader
            title="Usuários do Cliente"
            subheader={
              isLoadingUsers 
                ? "Carregando usuários..." 
                : `${clientUsers?.data?.length || 0} usuário(s) associado(s)`
            }
            avatar={<Person />}
          />
          <CardContent>
            {isLoadingUsers ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : usersError ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="error">
                  Erro ao carregar usuários do cliente
                </Typography>
              </Box>
            ) : !clientUsers?.data?.length ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Nenhum usuário associado a este cliente
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role do Sistema</TableCell>
                      <TableCell>Role do Cliente</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientUsers.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {user.photo?.path ? (
                              <Avatar 
                                src={user.photo.path} 
                                sx={{ width: 32, height: 32 }}
                              />
                            ) : (
                              <Avatar sx={{ width: 32, height: 32 }}>
                                <Person />
                              </Avatar>
                            )}
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {user.firstName} {user.lastName}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role?.name || "N/A"} 
                            color="primary" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.clientRole?.name || "N/A"} 
                            color="secondary" 
                            size="small"
                            title={user.clientRole?.description}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status?.name || "N/A"}
                            color={user.status?.name === "active" ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </AdminPageLayout>
  );
}
