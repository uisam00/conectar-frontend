import { useState } from "react";
import {
  Paper,
  Box,
  TextField,
  Link as MuiLink,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/services/i18n";
import { useAuthActions, useAuthTokens } from "@/services/auth";
import axiosInstance from "@/services/api/axios-instance";
import { AUTH_LOGIN_URL } from "@/services/api/config";
import { useErrorHandler } from "@/hooks";
import LabelInput from "@/components/form/label-input";

export default function SignInPage() {
  const { t } = useLanguage("sign-in");
  const { setTokensInfo } = useAuthTokens();
  const { setUser } = useAuthActions();
  const navigate = useNavigate();
  const { handleApiError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
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
      const response = await axiosInstance.post(AUTH_LOGIN_URL, formData);

      setTokensInfo({
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        tokenExpires: response.data.tokenExpires,
      });
      setUser(response.data.user);
      navigate("/");
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
        backgroundColor: "primary.main",
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
            label={t("inputs.email.label")}
            name="email"
            type="email"
            autoComplete="email"
            id="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5, color: "#333" }}>
              {t("inputs.password.label")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "stretch",
                gap: 0,
                width: "100%",
              }}
            >
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                id="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    height: 48,
                    "& fieldset": {
                      borderRight: "none",
                    },
                    "&:hover fieldset": {
                      borderRight: "none",
                    },
                    "&.Mui-focused fieldset": {
                      borderRight: "none",
                    },
                  },
                }}
              />
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                sx={{
                  color: "primary.main",
                  backgroundColor: "primary.light",
                  borderRadius: 3,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  height: 48,
                  width: 48,
                  minWidth: 48,
                  alignSelf: "stretch",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
          </Box>

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
              to="/forgot-password"
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
              {t("actions.forgotPassword")}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
