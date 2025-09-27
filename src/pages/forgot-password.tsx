import { useState } from "react";
import { Paper, Box, Typography, Link as MuiLink, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/services/i18n";
import useFetch from "@/services/api/use-fetch";
import { AUTH_FORGOT_PASSWORD_URL } from "@/services/api/config";
import { useSnackbar, useErrorHandler } from "@/hooks";
import LabelInput from "@/components/form/label-input";

export default function ForgotPasswordPage() {
  const { t } = useLanguage("forgot-password");
  const fetchBase = useFetch();
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const { handleApiError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchBase(AUTH_FORGOT_PASSWORD_URL, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showSuccess(t("messages.success"));
        navigate("/sign-in");
      } else {
        const errorData = await response.json();
        const errors = errorData.errors || errorData;
        handleApiError(errors);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #19AF78 0%, #0F7A5A 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <img
          src="/logo.png"
          alt="Conectar"
          style={{
            height: "80px",
            width: "auto",
            filter: "brightness(0) invert(1)",
          }}
        />
      </Box>

      <Paper
        elevation={8}
        sx={{
          padding: 2.5,
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#19AF78" }}
        >
          {t("title")}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ mb: 3, color: "#666" }}
        >
          {t("description")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <LabelInput
            label={t("inputs.email.label")}
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? t("loading") : t("actions.submit")}
          </Button>

          <Box textAlign="center" sx={{ mt: 1 }}>
            <MuiLink
              component={Link}
              to="/sign-in"
              variant="body2"
              sx={{
                color: "#666",
                textDecoration: "none",
                fontSize: "0.9rem",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("actions.backToSignIn")}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
