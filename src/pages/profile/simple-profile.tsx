import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Edit,
  Person,
  Email,
  Security,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/services/i18n";
import { useAuth } from "@/services/auth";
import { Helmet } from "react-helmet";
import PageLayout from "@/components/layout/page-layout";

export default function SimpleProfilePage() {
  const { t } = useLanguage("profile");
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Perfil | Conéctar</title>
        </Helmet>
        <PageLayout title={t("title")}>
          <Typography variant="h6" align="center">
            {t("signInRequired")}
          </Typography>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Perfil | Conéctar</title>
      </Helmet>
      <PageLayout title={t("title")}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person color="primary" />
                <Typography variant="h6">{t("userInformation")}</Typography>
              </Box>
            }
            action={
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => navigate("/profile/edit")}
              >
                {t("editProfile")}
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Avatar
                alt={`${user.firstName} ${user.lastName}`}
                src={user.photo?.path}
                sx={{ width: 120, height: 120, fontSize: "3rem" }}
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </Avatar>

              <Typography variant="h5" align="center">
                {t("welcome", { name: `${user.firstName} ${user.lastName}` })}
              </Typography>

              <Box sx={{ width: "100%", maxWidth: 400 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Email color="action" />
                  <Typography variant="body1">
                    <strong>{t("email")}:</strong> {user.email}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Security color="action" />
                  <Typography variant="body1">
                    <strong>{t("role")}:</strong> {user.role.name}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle color="success" />
                  <Typography variant="body1">
                    <strong>{t("status")}:</strong> {user.status.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </PageLayout>
    </>
  );
}
