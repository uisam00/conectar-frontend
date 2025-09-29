import { useState } from "react";
import { Paper, Box, Link as MuiLink, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/services/i18n";
import axiosInstance from "@/services/api/axios-instance";
import { AUTH_REGISTER_URL } from "@/services/api/config";
import { useErrorHandler } from "@/hooks";
import useSnackbar from "@/hooks/use-snackbar";
import LabelInput from "@/components/form/label-input";

export default function SignUpPage() {
  const { t } = useLanguage("sign-up");
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const { handleApiError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post(AUTH_REGISTER_URL, formData);

      showSuccess(
        "Registration successful! Please check your email to confirm your account."
      );
      navigate("/sign-in");
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
          padding: 3,
          width: "100%",
          maxWidth: 450,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <LabelInput
            label={t("inputs.firstName.label")}
            name="firstName"
            type="text"
            autoComplete="given-name"
            autoFocus
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <LabelInput
            label={t("inputs.lastName.label")}
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <LabelInput
            label={t("inputs.email.label")}
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <LabelInput
            label={t("inputs.password.label")}
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
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
              {t("actions.accountAlreadyExists")}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
