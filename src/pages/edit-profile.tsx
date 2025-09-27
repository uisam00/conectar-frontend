import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Collapse,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/services/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/services/i18n";
import { useSnackbar } from "@/hooks";
import { FILES_UPLOAD_URL, AUTH_UPDATE_URL } from "@/services/api/config";
import axiosInstance from "@/services/api/axios-instance";
import {
  ClearOutlined,
  DeleteOutline,
  Lock,
  Person,
  Edit,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import type { FileType } from "@/types/api";
import PageLayout from "@/components/layout/page-layout";

// Componente para mostrar critérios de senha
function PasswordCriteria({
  password,
  passwordConfirmation,
}: {
  password: string;
  passwordConfirmation: string;
}) {
  const { t } = useLanguage("edit-profile");

  const criteria = [
    {
      test: password.length >= 8,
      text: t("criteria.minLength"),
    },
    {
      test: /[A-Z]/.test(password),
      text: t("criteria.uppercase"),
    },
    {
      test: /\d/.test(password),
      text: t("criteria.number"),
    },
    {
      test: /[@$!%*?&]/.test(password),
      text: t("criteria.specialChar"),
    },
    {
      test:
        password && passwordConfirmation && password === passwordConfirmation,
      text: t("criteria.match"),
    },
  ];

  return (
    <Box
      sx={{
        mt: 1,
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
      }}
    >
      {criteria.map((criterion, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            width: { xs: "100%", sm: "calc(33.333% - 10px)" },
            minWidth: { xs: "100%", sm: "200px" },
            whiteSpace: "nowrap",
          }}
        >
          {criterion.test ? (
            <CheckCircle color="success" fontSize="small" />
          ) : (
            <Cancel color="error" fontSize="small" />
          )}
          <Typography
            variant="caption"
            sx={{
              color: criterion.test ? "success.main" : "error.main",
              fontSize: "0.7rem",
            }}
          >
            {criterion.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// Tipos
type EditProfileBasicInfoFormData = {
  firstName: string;
  lastName: string;
  photo?: FileType | null;
};

type EditProfileChangePasswordFormData = {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
};

// Validações
const useValidationBasicInfoSchema = () => {
  const { t } = useLanguage("edit-profile");

  return yup.object().shape({
    firstName: yup.string().required(t("required.firstName")),
    lastName: yup.string().required(t("required.lastName")),
  });
};

const useValidationChangePasswordSchema = () => {
  const { t } = useLanguage("edit-profile");

  return yup.object().shape({
    oldPassword: yup.string().required(t("required.oldPassword")),
    password: yup
      .string()
      .min(8, t("validation.password.minLength"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        t("validation.password.pattern")
      )
      .required(t("required.password")),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password")], t("validation.passwordConfirmation.match"))
      .required(t("required.passwordConfirmation")),
  });
};

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
  onDeleteCurrent,
  deleteCurrentPhoto,
  onLoadingChange,
}: {
  value?: FileType | null;
  onChange: (file: FileType | null) => void;
  onDeleteCurrent?: () => void;
  deleteCurrentPhoto?: boolean;
  error?: string;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
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
    disabled: isLoading,
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
        cursor: "pointer",
        position: "relative",
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
          alt={`${user?.firstName} ${user?.lastName}`}
          src={
            value?.path || (!deleteCurrentPhoto ? user?.photo?.path : undefined)
          }
          sx={{ width: 80, height: 80, fontSize: "2rem" }}
        >
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </Avatar>

        {value && (
          <IconButton
            onClick={removeAvatar}
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

        {user?.photo?.path && !deleteCurrentPhoto && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCurrent?.();
            }}
            sx={{
              position: "absolute",
              width: 25,
              height: 25,
              top: 0,
              right: 0,
              backgroundColor: "rgba(220, 38, 38, 0.8)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(220, 38, 38, 1)",
              },
            }}
          >
            <DeleteOutline sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

// Formulário de Informações Básicas
function FormBasicInfo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useLanguage("edit-profile");
  const { showSuccess, showError } = useSnackbar();
  const validationSchema = useValidationBasicInfoSchema();
  const [deleteCurrentPhoto, setDeleteCurrentPhoto] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm<EditProfileBasicInfoFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      photo: null,
    },
  });

  const { handleSubmit, reset, watch, setValue } = methods;
  const photo = watch("photo");

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const updateData: {
        firstName: string;
        lastName: string;
        photo?: { id: string } | null;
      } = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      if (formData.photo) {
        updateData.photo = { id: formData.photo.id };
      } else if (deleteCurrentPhoto) {
        updateData.photo = null;
      }

      const response = await axiosInstance.patch(AUTH_UPDATE_URL, updateData);

      const updatedUser = response.data;
      // Invalidar cache do React Query para recarregar dados do usuário
      queryClient.setQueryData(["user"], updatedUser);
      showSuccess(t("success.profile"));
      reset({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        photo: null,
      });
      setDeleteCurrentPhoto(false);
    } catch {
      showError(t("error.generic"));
    }
  });

  const handleDeleteCurrentPhoto = () => {
    setDeleteCurrentPhoto(true);
    setValue("photo", null);
  };

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photo: null,
      });
    }
  }, [user, reset]);

  return (
    <FormProvider {...methods}>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<Person sx={{ color: "primary.main" }} />}
          title={t("title1")}
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
                onDeleteCurrent={handleDeleteCurrentPhoto}
                deleteCurrentPhoto={deleteCurrentPhoto}
                onLoadingChange={setIsUploading}
              />

              <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
                <TextField
                  {...methods.register("firstName")}
                  label={t("firstName")}
                  fullWidth
                  error={!!methods.formState.errors.firstName}
                  helperText={methods.formState.errors.firstName?.message}
                />

                <TextField
                  {...methods.register("lastName")}
                  label={t("lastName")}
                  fullWidth
                  error={!!methods.formState.errors.lastName}
                  helperText={methods.formState.errors.lastName?.message}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<Edit />}
                disabled={isUploading}
                sx={{ maxWidth: 300 }}
              >
                {isUploading ? "Enviando..." : t("save")}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}

// Formulário de Alteração de Senha
function FormChangePassword() {
  const { t } = useLanguage("edit-profile");
  const { showSuccess, showError } = useSnackbar();
  const validationSchema = useValidationChangePasswordSchema();
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<EditProfileChangePasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { handleSubmit, reset, watch } = methods;
  const password = watch("password");
  const passwordConfirmation = watch("passwordConfirmation");

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await axiosInstance.patch(AUTH_UPDATE_URL, {
        password: formData.password,
        oldPassword: formData.oldPassword,
      });

      showSuccess(t("success.password"));
      reset();
    } catch {
      showError(t("error.generic"));
    }
  });

  return (
    <Card>
      <CardHeader
        avatar={<Lock sx={{ color: "primary.main" }} />}
        title={t("title3")}
        titleTypographyProps={{
          variant: "h6",
          fontWeight: "bold",
          color: "primary.main",
        }}
        action={
          <Button
            variant="outlined"
            startIcon={<Lock />}
            onClick={() => setIsOpen(!isOpen)}
            sx={{ mr: 1 }}
          >
            {isOpen ? "Fechar" : "Alterar Senha"}
          </Button>
        }
      />
      <Divider />
      <Collapse in={isOpen}>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  <TextField
                    {...methods.register("oldPassword")}
                    label={t("oldPassword")}
                    type="password"
                    fullWidth
                    error={!!methods.formState.errors.oldPassword}
                    helperText={methods.formState.errors.oldPassword?.message}
                  />
                  <TextField
                    {...methods.register("password")}
                    label={t("newPassword")}
                    type="password"
                    fullWidth
                    error={!!methods.formState.errors.password}
                    helperText={methods.formState.errors.password?.message}
                  />

                  <TextField
                    {...methods.register("passwordConfirmation")}
                    label={t("passwordConfirmation")}
                    type="password"
                    fullWidth
                    error={!!methods.formState.errors.passwordConfirmation}
                    helperText={
                      methods.formState.errors.passwordConfirmation?.message
                    }
                  />
                </Box>
                <PasswordCriteria
                  password={password || ""}
                  passwordConfirmation={passwordConfirmation || ""}
                />

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Edit />}
                    sx={{ minWidth: 200 }}
                  >
                    {t("save")}
                  </Button>
                </Box>
              </Box>
            </form>
          </FormProvider>
        </CardContent>
      </Collapse>
    </Card>
  );
}

// Componente Principal
export default function EditProfilePage() {
  return (
    <PageLayout title="Editar Perfil">
      <FormBasicInfo />
      <FormChangePassword />
    </PageLayout>
  );
}
