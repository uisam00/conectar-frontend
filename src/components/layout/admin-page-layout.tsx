import { Box, Container } from "@mui/material";
import { type ReactNode } from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

interface AdminPageLayoutProps {
  children: ReactNode;
  showBreadcrumb?: boolean;
}

export default function AdminPageLayout({
  children,
  showBreadcrumb = true,
}: AdminPageLayoutProps) {
  return (
    <Box
      sx={{
        py: { xs: 2, sm: 3 },
        pt: { xs: 10, sm: 10 }, // Compensar altura do AppBar fixo
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3 },
          height: "100%",
          overflow: "auto",
        }}
      >
        {showBreadcrumb && <Breadcrumb />}
        {children}
      </Container>
    </Box>
  );
}
