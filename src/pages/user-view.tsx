import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useLanguage } from "@/services/i18n";
import { useUserQuery } from "@/hooks/use-user-query";
import { useDeleteUser } from "@/hooks/use-delete-user";
import UserForm from "@/components/user-form";
import PageLayout from "@/components/layout/page-layout";

export default function UserViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage("createUser");
  const userId = id ? parseInt(id) : 0;

  const { data: user, isLoading, error } = useUserQuery(userId);
  const deleteUserMutation = useDeleteUser();

  const handleEdit = () => {
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleBack = () => {
    navigate("/admin/users");
  };

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Erro ao carregar usuário. Tente novamente.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Usuário não encontrado.</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  const formData = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    photo: user.photo,
    roleId: user.role?.id || 2,
    statusId: user.status?.id || 1,
    clientRoles:
      user.clients?.map((client: any) => ({
        clientId: client.id,
        clientRoleId: client.clientRoleId,
        clientName: client.razaoSocial,
        roleName: client.roleName || "Usuário",
      })) || [],
  };

  return (
    <PageLayout title="Visualizar Usuário">
      <Card>
        <CardHeader
          title="Informações do Usuário"
          action={
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
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : (
                  "Excluir"
                )}
              </Button>
            </Box>
          }
        />
        <CardContent>
          <UserForm
            initialData={formData}
            onSubmit={() => {}} // Não faz nada na visualização
            isReadOnly={true}
            showPassword={false}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
