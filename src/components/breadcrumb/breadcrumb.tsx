import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "@mui/icons-material";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items = [] }: BreadcrumbProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Gerar breadcrumb automático baseado na rota
  const generateBreadcrumb = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [{ label: "Home", path: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Mapear segmentos para labels mais amigáveis
      const labelMap: Record<string, string> = {
        admin: "Administração",
        clients: "Clientes",
        profile: "Perfil",
        edit: "Editar",
      };

      const label =
        labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

      // Não adicionar link para a página atual
      const isLast = index === pathSegments.length - 1;
      breadcrumbItems.push({
        label,
        path: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumb();

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        separator={<ChevronRight fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbItems.map((item, index) => (
          <Box key={index}>
            {item.path ? (
              <Link
                component="button"
                variant="body2"
                onClick={() => handleClick(item.path!)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textDecoration: "none",
                  color: "primary.main",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {index === 0 && <Home fontSize="small" />}
                {item.label}
              </Link>
            ) : (
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {index === 0 && <Home fontSize="small" />}
                {item.label}
              </Typography>
            )}
          </Box>
        ))}
      </Breadcrumbs>
    </Box>
  );
}
