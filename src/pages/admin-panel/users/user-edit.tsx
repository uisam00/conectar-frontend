import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack, Save, Delete } from "@mui/icons-material";
import { useUserQuery } from "@/hooks/use-user-query";
import { useUpdateUser } from "@/hooks/use-update-user";
import { useDeleteUser } from "@/hooks/use-delete-user";
import UserForm from "@/components/user-form";
import PageLayout from "@/components/layout/page-layout";
import { Helmet } from "react-helmet";

interface UserFormData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  photo?: any;
  roleId: number;
  statusId: number;
  clientRoles: {
    clientId: number;
    clientRoleId: number;
    clientName: string;
    roleName: string;
  }[];
}

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? parseInt(id) : 0;

  const { data: user, isLoading, error } = useUserQuery(userId);
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleSave = (formData: UserFormData) => {
    const updateData: any = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: { id: formData.roleId },
      status: { id: formData.statusId },
      clientRoles: formData.clientRoles.map((cr) => ({
        clientId: cr.clientId,
        clientRoleId: cr.clientRoleId,
      })),
    };

    // Adicionar senha apenas se fornecida
    if (formData.password && formData.password.trim() !== "") {
      updateData.password = formData.password;
    }

    // Tratar foto: nova foto, remoção ou sem mudanças
    if (formData.photo?.id) {
      // Nova foto selecionada
      updateData.photo = { id: formData.photo.id };
    } else if (formData.photo === null && user?.photo?.id) {
      // Foto atual foi removida (null explícito)
      updateData.photo = null;
    }
    // Se formData.photo for undefined, não envia o campo photo (sem mudanças)

    updateUserMutation.mutate({ id: userId, data: updateData });
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleBack = () => {
    navigate("/admin/users");
  };

  const isLoadingForm = isLoading || updateUserMutation.isPending;
  const isFormDisabled = isLoadingForm;

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
    photo: user.photo
      ? {
          id: user.photo.id.toString(),
          path: user.photo.path,
        }
      : null,
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
    <>
      <Helmet>
        <title>Editar Usuário | Conéctar</title>
      </Helmet>
      <PageLayout title="Editar Usuário">
        <Card>
          <CardHeader
            action={
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={handleBack}
                  disabled={isFormDisabled}
                >
                  Voltar
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    isLoadingForm ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Save />
                    )
                  }
                  onClick={() => {
                    // O formulário será submetido pelo UserForm
                    const form = document.querySelector("form");
                    if (form) {
                      form.requestSubmit();
                    }
                  }}
                  disabled={isFormDisabled}
                >
                  {isLoadingForm ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                  disabled={isFormDisabled || deleteUserMutation.isPending}
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
              onSubmit={handleSave}
              isLoading={isFormDisabled}
              showPassword={true}
            />
          </CardContent>
        </Card>
      </PageLayout>
    </>
  );
}
