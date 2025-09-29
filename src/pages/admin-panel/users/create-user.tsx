import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Helmet } from "react-helmet";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useSnackbar from "@/hooks/use-snackbar";
import { useLanguage } from "@/services/i18n";
import axiosInstance from "@/services/api/axios-instance";
import type { CreateUserDto, FileType } from "@/types/api";
import { Person, ClearOutlined, Add } from "@mui/icons-material";
import ClientRoleSelector from "@/components/form/client-role-selector";
import StatusSelectFixed from "@/components/form/status-select-fixed";

const FILES_UPLOAD_URL = "/v1/files/upload";
const USERS_CREATE_URL = "/v1/users";

interface CreateUserFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  photo?: FileType | null;
  roleId: number;
  statusId: number;
  clientRoles: {
    clientId: number;
    clientRoleId: number;
    clientName: string;
    roleName: string;
  }[];
}

// Serviço de Upload de Arquivos
function useFileUploadService() {
  return async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(FILES_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { status: response.status, data: response.data };
  };
}

// Componente Avatar Input
function AvatarInput({
  value,
  onChange,
  onLoadingChange,
  disabled = false,
}: {
  value?: FileType | null;
  onChange: (file: FileType | null) => void;
  onLoadingChange?: (loading: boolean) => void;
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const fetchFileUpload = useFileUploadService();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsLoading(true);
      onLoadingChange?.(true);
      try {
        const { status, data } = await fetchFileUpload(acceptedFiles[0]);
        if (status === 201) {
          onChange(data.file);
        }
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
      "image/webp": [],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2, // 2MB
    disabled: isLoading || disabled,
  });

  const removeAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        position: "relative",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
        ></Box>
      )}

      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Avatar
          alt="Foto do usuário"
          src={value?.path}
          sx={{ width: 80, height: 80, fontSize: "2rem" }}
        >
          {value ? "U" : "?"}
        </Avatar>

        {value && (
          <IconButton
            onClick={removeAvatar}
            disabled={disabled}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
            size="small"
          >
            <ClearOutlined sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

// Status padrão: 1 = Ativo (não precisa buscar do endpoint)

export default function CreateUserPage() {
  const { t } = useLanguage("createUser");
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isLoading = isUploading || isCreating;

  const methods = useForm<CreateUserFormData>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      photo: null,
      roleId: 2, // Usuário por padrão
      statusId: 1, // Ativo por padrão
      clientRoles: [],
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const photo = watch("photo");

  const onSubmit = handleSubmit(async (formData) => {
    setIsCreating(true);
    try {
      const createData: CreateUserDto = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.roleId ? { id: formData.roleId } : undefined,
        status: { id: formData.statusId },
        photo: formData.photo ? { id: formData.photo.id } : undefined,
        clientRoles: formData.clientRoles,
      };

      await axiosInstance.post(USERS_CREATE_URL, createData);

      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess(t("success.userCreated"));
      navigate("/admin/users");
    } catch (error: any) {
      console.error("Error creating user:", error);
      showError(t("error.createUser"));
    } finally {
      setIsCreating(false);
    }
  });

  const handleClientRoleChange = (assignments: any[]) => {
    setValue("clientRoles", assignments);
  };

  return (
    <>
      <Helmet>
        <title>Criar Usuário | Conéctar</title>
      </Helmet>
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 2, color: "primary.main" }}
        >
          {t("title")}
        </Typography>

        <FormProvider {...methods}>
          <Card>
            <CardHeader
              avatar={<Person sx={{ color: "primary.main" }} />}
              title={t("form.title")}
              titleTypographyProps={{
                variant: "h6",
                fontWeight: "bold",
                color: "primary.main",
              }}
            />
            <Divider />
            <CardContent>
              <form onSubmit={onSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    alignItems: "center",
                  }}
                >
                  <AvatarInput
                    value={photo}
                    onChange={(file) => setValue("photo", file)}
                    onLoadingChange={setIsUploading}
                    disabled={isLoading}
                  />

                  <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
                    <TextField
                      {...methods.register("firstName")}
                      label={t("form.firstName")}
                      fullWidth
                      disabled={isLoading}
                      error={!!methods.formState.errors.firstName}
                      helperText={methods.formState.errors.firstName?.message}
                    />

                    <TextField
                      {...methods.register("lastName")}
                      label={t("form.lastName")}
                      fullWidth
                      disabled={isLoading}
                      error={!!methods.formState.errors.lastName}
                      helperText={methods.formState.errors.lastName?.message}
                    />
                  </Box>

                  <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
                    <TextField
                      {...methods.register("email")}
                      label={t("form.email")}
                      type="email"
                      fullWidth
                      disabled={isLoading}
                      error={!!methods.formState.errors.email}
                      helperText={methods.formState.errors.email?.message}
                    />

                    <TextField
                      {...methods.register("password")}
                      label={t("form.password")}
                      type="password"
                      fullWidth
                      disabled={isLoading}
                      error={!!methods.formState.errors.password}
                      helperText={methods.formState.errors.password?.message}
                    />
                  </Box>

                  <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
                    <FormControl
                      fullWidth
                      disabled={isLoading}
                      error={!!methods.formState.errors.roleId}
                    >
                      <InputLabel>Função do Sistema</InputLabel>
                      <Select
                        {...methods.register("roleId")}
                        value={watch("roleId") || 2}
                        onChange={(e) =>
                          setValue("roleId", Number(e.target.value))
                        }
                        label="Função do Sistema"
                      >
                        <MenuItem value={1}>Administrador</MenuItem>
                        <MenuItem value={2}>Usuário</MenuItem>
                      </Select>
                    </FormControl>

                    <StatusSelectFixed
                      value={watch("statusId") || 1}
                      onChange={(statusId) => setValue("statusId", statusId)}
                      disabled={isLoading}
                      error={!!methods.formState.errors.statusId}
                      helperText={methods.formState.errors.statusId?.message}
                    />
                  </Box>

                  <ClientRoleSelector
                    value={watch("clientRoles")}
                    onChange={handleClientRoleChange}
                    disabled={isLoading}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      width: "100%",
                      maxWidth: 400,
                    }}
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      fullWidth
                      disabled={isLoading}
                      onClick={() => navigate("/admin/users")}
                    >
                      {t("form.cancel")}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Add />
                        )
                      }
                      disabled={isLoading}
                    >
                      {t("form.create")}
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </FormProvider>
      </Box>
    </>
  );
}
