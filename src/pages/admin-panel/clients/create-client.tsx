import { Box, Typography } from "@mui/material";
import { useCreateClient } from "@/hooks/use-create-client";
import ClientForm from "@/components/client-form";
import AdminPageLayout from "@/components/layout/admin-page-layout";
import type { CreateClientDto } from "@/services/api/clients-api";
import { Helmet } from "react-helmet";

export default function CreateClientPage() {
  const createClientMutation = useCreateClient();

  const handleSubmit = (data: CreateClientDto | any) => {
    createClientMutation.mutate(data as CreateClientDto);
  };

  return (
    <>
      <Helmet>
        <title>Criar Instituição | Conéctar</title>
      </Helmet>
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
    </>
  );
}
