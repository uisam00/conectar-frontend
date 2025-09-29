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
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: 800,
            mx: "auto",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              mb: 2,
              color: "primary.main",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
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
