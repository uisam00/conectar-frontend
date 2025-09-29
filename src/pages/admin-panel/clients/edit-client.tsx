import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useLanguage } from "@/services/i18n";
import { useClientQuery } from "@/hooks/use-client-query";
import { useUpdateClient } from "@/hooks/use-update-client";
import ClientForm from "@/components/client-form";
import AdminPageLayout from "@/components/layout/admin-page-layout";
import type { UpdateClientDto } from "@/services/api/clients-api";

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage("edit-client");
  const clientId = id ? parseInt(id) : 0;

  const { data: client, isLoading, error } = useClientQuery(clientId);
  const updateClientMutation = useUpdateClient();

  const handleSubmit = (data: UpdateClientDto) => {
    updateClientMutation.mutate({ id: clientId, data });
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
          <Typography variant="body1" sx={{ ml: 2 }}>
            {t("loading")}
          </Typography>
        </Box>
      </AdminPageLayout>
    );
  }

  if (error || !client) {
    return (
      <AdminPageLayout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            {t("clientNotFound")}
          </Typography>
        </Box>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 2, color: "primary.main" }}
        >
          {t("title")}
        </Typography>

        <ClientForm
          initialData={client}
          onSubmit={handleSubmit}
          isLoading={updateClientMutation.isPending}
        />
      </Box>
    </AdminPageLayout>
  );
}
