import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { PhotoCamera, Save, Cancel } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/services/auth";
import { useSnackbar, useFileUpload } from "@/hooks";
import { useLanguage } from "@/services/i18n";
import useFetch from "@/services/api/use-fetch";
import { AUTH_UPDATE_URL } from "@/services/api/config";
import type { AuthUpdateDto, User } from "@/types/api";

const createSchema = (t: any) =>
  yup.object({
    firstName: yup.string().required(t("required.firstName")),
    lastName: yup.string().required(t("required.lastName")),
    password: yup.string().optional(),
    oldPassword: yup.string().when("password", {
      is: (password: string) => password && password.length > 0,
      then: schema => schema.required(t("required.currentPassword")),
      otherwise: schema => schema.notRequired(),
    }),
  });

type FormData = yup.InferType<ReturnType<typeof createSchema>>;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguage("edit-profile");
  const fetchBase = useFetch();

  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const {
    uploading: uploadingPhoto,
    preview: photoPreview,
    uploadFile,
    resetPreview,
  } = useFileUpload({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/"],
    onSuccess: file => {
      if (user) {
        setUser({
          ...user,
          photo: file,
        });
      }
    },
  });

  const schema = createSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      password: "",
      oldPassword: "",
    },
  });

  const watchedPassword = watch("password");

  useEffect(() => {
    if (user?.photo?.path) {
      setPhotoPreview(user.photo.path);
    }
  }, [user]);

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadFile(file);
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    // Clear password fields when hiding
    if (showPasswordFields) {
      reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        password: "",
        oldPassword: "",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      // Validate password if fields are visible and password is provided
      if (
        showPasswordFields &&
        data.password &&
        data.password.trim().length > 0
      ) {
        if (data.password.length < 6) {
          showSnackbar(
            "A nova senha deve ter pelo menos 6 caracteres",
            "error"
          );
          setLoading(false);
          return;
        }
        if (!data.oldPassword || data.oldPassword.trim().length === 0) {
          showSnackbar(
            "A senha atual é obrigatória para alterar a senha",
            "error"
          );
          setLoading(false);
          return;
        }
      }

      const updateData: AuthUpdateDto = {
        firstName: data.firstName,
        lastName: data.lastName,
      };

      // Only include password fields if password fields are visible and password is being changed
      if (
        showPasswordFields &&
        data.password &&
        data.password.trim().length > 0
      ) {
        updateData.password = data.password;
        updateData.oldPassword = data.oldPassword;
      }

      const response = await fetchBase(AUTH_UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        showSnackbar(t("success"), "success");
        reset({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          password: "",
          oldPassword: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || t("error"));
      }
    } catch (error) {
      console.error("Profile update error:", error);
      showSnackbar(
        error instanceof Error ? error.message : t("error"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      password: "",
      oldPassword: "",
    });
    navigate("/profile");
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          Você precisa estar logado para editar o perfil.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t("title")}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={photoPreview || undefined}
                sx={{ width: 120, height: 120, fontSize: "3rem" }}
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </Avatar>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="photo-upload"
                type="file"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
              />
              <label htmlFor="photo-upload">
                <Button
                  component="span"
                  variant="contained"
                  startIcon={<PhotoCamera />}
                  disabled={uploadingPhoto}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    minWidth: "auto",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#19AF78",
                    "&:hover": { backgroundColor: "#0F7A5A" },
                  }}
                >
                  {uploadingPhoto && (
                    <CircularProgress size={20} color="inherit" />
                  )}
                </Button>
              </label>
            </Box>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("firstName")}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("lastName")}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("email")}
                  value={user.email}
                  disabled
                  helperText={t("emailHelper")}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={togglePasswordFields}
                    sx={{
                      color: "#19AF78",
                      borderColor: "#19AF78",
                      "&:hover": {
                        borderColor: "#0F7A5A",
                        backgroundColor: "rgba(25, 175, 120, 0.04)",
                      },
                    }}
                  >
                    {showPasswordFields
                      ? t("cancelPasswordChange")
                      : t("changePasswordButton")}
                  </Button>
                </Box>
              </Grid>

              {showPasswordFields && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t("changePassword")}
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="oldPassword"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="password"
                          label={t("currentPassword")}
                          error={!!errors.oldPassword}
                          helperText={errors.oldPassword?.message}
                          disabled={loading}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="password"
                          label={t("newPassword")}
                          error={!!errors.password}
                          helperText={errors.password?.message}
                          disabled={loading}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-end",
                    mt: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading}
                    startIcon={<Cancel />}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !isDirty}
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <Save />
                    }
                    sx={{
                      backgroundColor: "#19AF78",
                      "&:hover": { backgroundColor: "#0F7A5A" },
                    }}
                  >
                    {loading ? t("saving") : t("save")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
