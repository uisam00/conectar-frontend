import React from "react";
import { Box, Typography } from "@mui/material";
import { useLanguage } from "@/services/i18n";
import { useCreateClient } from "@/hooks/use-create-client";
import ClientForm from "@/components/client-form";
import AdminPageLayout from "@/components/layout/admin-page-layout";
import type { CreateClientDto } from "@/services/api/clients-api";

export default function CreateClientPage() {
  const { t } = useLanguage("clients");
  const createClientMutation = useCreateClient();

  const handleSubmit = (data: CreateClientDto) => {
    createClientMutation.mutate(data);
  };

  return (
    <AdminPageLayout>
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 2, color: "primary.main" }}
        >
          Criar Cliente
        </Typography>

        <ClientForm
          onSubmit={handleSubmit}
          isLoading={createClientMutation.isPending}
        />
      </Box>
    </AdminPageLayout>
  );
}
