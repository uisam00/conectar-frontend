import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Container,
} from "@mui/material";
import { CheckCircle, Error, Email } from "@mui/icons-material";
import { authApi } from "@/services/api/auth";
import { useLanguage } from "@/services/i18n";

type ConfirmationStatus = "loading" | "success" | "error";

export default function ConfirmEmailPage() {
  const { t } = useLanguage("common");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ConfirmationStatus>("loading");
  const [message, setMessage] = useState<string>("");

  const hash = searchParams.get("hash");

  useEffect(() => {
    const confirmEmail = async () => {
      if (!hash) {
        setStatus("error");
        setMessage(t("emailConfirmation.hashNotFound"));
        return;
      }

      try {
        await authApi.confirmEmail({ hash });
        setStatus("success");
        setMessage(t("emailConfirmation.successMessage"));
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || t("emailConfirmation.errorMessage")
        );
      }
    };

    confirmEmail();
  }, [hash, t]);

  const handleGoToLogin = () => {
    navigate("/sign-in");
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              {t("emailConfirmation.loading")}
            </Typography>
          </Box>
        );

      case "success":
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
            <CheckCircle sx={{ fontSize: 80, color: "success.main" }} />
            <Typography variant="h5" color="success.main" textAlign="center">
              {t("emailConfirmation.success")}
            </Typography>
            <Alert severity="success" sx={{ width: "100%" }}>
              {message}
            </Alert>
            <Button
              variant="contained"
              size="large"
              onClick={handleGoToLogin}
              sx={{ mt: 2 }}
            >
              {t("emailConfirmation.goToLogin")}
            </Button>
          </Box>
        );

      case "error":
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
            <Error sx={{ fontSize: 80, color: "error.main" }} />
            <Typography variant="h5" color="error.main" textAlign="center">
              {t("emailConfirmation.error")}
            </Typography>
            <Alert severity="error" sx={{ width: "100%" }}>
              {message}
            </Alert>
            <Button
              variant="outlined"
              size="large"
              onClick={handleGoToLogin}
              sx={{ mt: 2 }}
            >
              {t("emailConfirmation.goToLogin")}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Email sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography variant="h4" component="h1" textAlign="center">
            {t("emailConfirmation.title")}
          </Typography>
        </Box>

        {renderContent()}
      </Paper>
    </Container>
  );
}
