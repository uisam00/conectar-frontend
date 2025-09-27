import { Box, Container, Typography } from "@mui/material";
import type { ReactNode } from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  showBreadcrumb?: boolean;
}

export default function PageLayout({
  title,
  children,
  showBreadcrumb = true,
}: PageLayoutProps) {
  return (
    <Box
      sx={{
        py: 3,
        pt: { xs: 10, sm: 10 }, // Compensar altura do AppBar fixo
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        {showBreadcrumb && <Breadcrumb />}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4, color: "primary.main" }}
        >
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  );
}
