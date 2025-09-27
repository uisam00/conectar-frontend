import { Box, Container } from "@mui/material";
import { ReactNode } from "react";
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
    <Box sx={{ py: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        {showBreadcrumb && <Breadcrumb />}
        {children}
      </Container>
    </Box>
  );
}
