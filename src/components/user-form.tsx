import React, { useState } from "react";
import {
  Box,
  TextField,
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
import { useLanguage } from "@/services/i18n";
import axiosInstance from "@/services/api/axios-instance";
import type { FileType } from "@/types/api";
import { Person, ClearOutlined } from "@mui/icons-material";
import ClientRoleSelector from "@/components/form/client-role-selector";

const FILES_UPLOAD_URL = "/v1/files/upload";

interface UserFormData {
  email: string;
  password?: string;
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

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  isReadOnly?: boolean;
  showPassword?: boolean;
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
  isReadOnly = false,
}: {
  value?: FileType | null;
  onChange: (file: FileType | null) => void;
  onLoadingChange?: (loading: boolean) => void;
  disabled?: boolean;
  isReadOnly?: boolean;
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
    disabled: isLoading || disabled || isReadOnly,
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
        cursor: isReadOnly ? "default" : disabled ? "not-allowed" : "pointer",
        position: "relative",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input {...getInputProps()} />
      {isDragActive && !isReadOnly && (
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

        {value && !isReadOnly && (
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

      {!isReadOnly && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, textAlign: "center" }}
        >
          Clique ou arraste uma imagem
        </Typography>
      )}
    </Box>
  );
}

export default function UserForm({
  initialData,
  onSubmit,
  isLoading = false,
  isReadOnly = false,
  showPassword = true,
}: UserFormProps) {
  const { t } = useLanguage("createUser");
  const [isUploading, setIsUploading] = useState(false);

  // Estado de loading combinado
  const isFormLoading = isLoading || isUploading;

  const methods = useForm<UserFormData>({
    defaultValues: {
      email: initialData?.email || "",
      password: initialData?.password || "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      photo: initialData?.photo || null,
      roleId: initialData?.roleId || 2,
      statusId: initialData?.statusId || 1,
      clientRoles: initialData?.clientRoles || [],
    },
  });

  const { handleSubmit, setValue, watch } = methods;
  const photo = watch("photo");

  const handleClientRoleChange = (newClientRoles: any[]) => {
    setValue("clientRoles", newClientRoles);
  };

  const onFormSubmit = handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      <form onSubmit={onFormSubmit}>
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
            disabled={isFormLoading}
            isReadOnly={isReadOnly}
          />

          <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
            <TextField
              {...methods.register("firstName")}
              label={t("form.firstName")}
              fullWidth
              disabled={isFormLoading || isReadOnly}
              error={!!methods.formState.errors.firstName}
              helperText={methods.formState.errors.firstName?.message}
            />
            <TextField
              {...methods.register("lastName")}
              label={t("form.lastName")}
              fullWidth
              disabled={isFormLoading || isReadOnly}
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
              disabled={isFormLoading || isReadOnly}
              error={!!methods.formState.errors.email}
              helperText={methods.formState.errors.email?.message}
            />
            {showPassword && (
              <TextField
                {...methods.register("password")}
                label={t("form.password")}
                type="password"
                fullWidth
                disabled={isFormLoading || isReadOnly}
                error={!!methods.formState.errors.password}
                helperText={methods.formState.errors.password?.message}
              />
            )}
          </Box>

          <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
            <FormControl
              fullWidth
              disabled={isFormLoading || isReadOnly}
              error={!!methods.formState.errors.roleId}
            >
              <InputLabel>Função do Sistema</InputLabel>
              <Select
                {...methods.register("roleId")}
                value={watch("roleId") || 2}
                onChange={(e) => setValue("roleId", Number(e.target.value))}
                label="Função do Sistema"
              >
                <MenuItem value={1}>Administrador</MenuItem>
                <MenuItem value={2}>Usuário</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              disabled={isFormLoading || isReadOnly}
              error={!!methods.formState.errors.statusId}
            >
              <InputLabel>Status</InputLabel>
              <Select
                {...methods.register("statusId")}
                value={watch("statusId") || 1}
                onChange={(e) => setValue("statusId", Number(e.target.value))}
                label="Status"
              >
                <MenuItem value={1}>Ativo</MenuItem>
                <MenuItem value={2}>Inativo</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <ClientRoleSelector
            value={watch("clientRoles")}
            onChange={handleClientRoleChange}
            disabled={isFormLoading || isReadOnly}
          />
        </Box>
      </form>
    </FormProvider>
  );
}
