import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useLanguage } from "@/services/i18n";
import { useUserQuery } from "@/hooks/use-user-query";
import { useDeleteUser } from "@/hooks/use-delete-user";
import UserForm from "@/components/user-form";
import PageLayout from "@/components/layout/page-layout";
import { Helmet } from "react-helmet";

export default function UserViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage("user-view");
  const userId = id ? parseInt(id) : 0;

  const { data: user, isLoading, error } = useUserQuery(userId);
  const deleteUserMutation = useDeleteUser();

  const handleEdit = () => {
    navigate(`/admin/users/edit/${userId}`);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          {t("loading")}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t("loadError")}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          {t("actions.back")}
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">{t("userNotFound")}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          {t("actions.back")}
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
        <title>Visualizar Usuário | Conéctar</title>
      </Helmet>
      <PageLayout title={t("title")}>
        <Card>
          <CardHeader
            title={t("card.title")}
            action={
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={handleBack}
                >
                  {t("actions.back")}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  {t("actions.edit")}
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
                    t("actions.delete")
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
    </>
  );
}
