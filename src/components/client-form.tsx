import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axiosInstance from "@/services/api/axios-instance";
import type {
  CreateClientDto,
  UpdateClientDto,
  Client,
} from "@/services/api/clients-api";
import { Business, ClearOutlined, Save } from "@mui/icons-material";
import PlanSelect from "./form/plan-select";
import StatusSelectFixed from "./form/status-select-fixed";

const FILES_UPLOAD_URL = "/v1/files/upload";

interface ClientFormData {
  razaoSocial: string;
  cnpj: string;
  nomeComercial?: string;
  statusId: number;
  planId: number;
  photo?: {
    id: string;
    path: string;
  } | null;
}

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: CreateClientDto | UpdateClientDto) => void;
  isLoading?: boolean;
  isReadOnly?: boolean;
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
  value?: { id: string; path: string } | null;
  onChange: (file: { id: string; path: string } | null) => void;
  onLoadingChange?: (loading: boolean) => void;
  disabled?: boolean;
  isReadOnly?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const fetchFileUpload = useFileUploadService();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isReadOnly) {
      setIsLoading(true);
      onLoadingChange?.(true);
      try {
        const { status, data } = await fetchFileUpload(acceptedFiles[0]);
        if (status === 201) {
          onChange(data.file);
        }
      } catch (error) {
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
    if (!isReadOnly) {
      onChange(null);
    }
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
          alt="Logo do cliente"
          src={value?.path}
          sx={{ width: 80, height: 80, fontSize: "2rem" }}
        >
          {value ? "C" : "?"}
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
    </Box>
  );
}

export default function ClientForm({
  initialData,
  onSubmit,
  isLoading = false,
  isReadOnly = false,
}: ClientFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  const loading = isUploading || isLoading;

  const methods = useForm<ClientFormData>({
    defaultValues: {
      razaoSocial: initialData?.razaoSocial || "",
      cnpj: initialData?.cnpj || "",
      nomeComercial: initialData?.nomeComercial || "",
      statusId: initialData?.statusId || 1,
      planId: initialData?.planId || 1,
      photo: initialData?.photo || null,
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const photo = watch("photo");

  const onSubmitForm = handleSubmit(async (formData) => {
    const submitData = {
      razaoSocial: formData.razaoSocial,
      cnpj: formData.cnpj,
      nomeComercial: formData.nomeComercial || undefined,
      statusId: formData.statusId,
      planId: formData.planId,
      photo: formData.photo ? { id: formData.photo.id } : null,
    };

    onSubmit(submitData);
  });

  return (
    <FormProvider {...methods}>
      <Card>
        <CardHeader
          avatar={<Business sx={{ color: "primary.main" }} />}
          title={
            isReadOnly
              ? "Visualizar Cliente"
              : initialData
                ? "Editar Cliente"
                : "Criar Cliente"
          }
          titleTypographyProps={{
            variant: "h6",
            fontWeight: "bold",
            color: "primary.main",
          }}
        />
        <CardContent>
          <form onSubmit={onSubmitForm}>
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
                disabled={loading}
                isReadOnly={isReadOnly}
              />

              <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
                <TextField
                  {...methods.register("razaoSocial")}
                  label="Razão Social"
                  fullWidth
                  disabled={loading || isReadOnly}
                  error={!!methods.formState.errors.razaoSocial}
                  helperText={methods.formState.errors.razaoSocial?.message}
                />

                <TextField
                  {...methods.register("cnpj")}
                  label="CNPJ"
                  fullWidth
                  disabled={loading || isReadOnly}
                  error={!!methods.formState.errors.cnpj}
                  helperText={methods.formState.errors.cnpj?.message}
                />
              </Box>

              <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
                <TextField
                  {...methods.register("nomeComercial")}
                  label="Nome Comercial"
                  fullWidth
                  disabled={loading || isReadOnly}
                  error={!!methods.formState.errors.nomeComercial}
                  helperText={methods.formState.errors.nomeComercial?.message}
                />

                <StatusSelectFixed
                  value={watch("statusId") || 1}
                  onChange={(statusId) => setValue("statusId", statusId)}
                  disabled={loading || isReadOnly}
                  error={!!methods.formState.errors.statusId}
                  helperText={methods.formState.errors.statusId?.message}
                />
              </Box>

              <PlanSelect
                value={watch("planId") || 1}
                onChange={(planId) => setValue("planId", planId)}
                disabled={loading || isReadOnly}
                error={!!methods.formState.errors.planId}
                helperText={methods.formState.errors.planId?.message}
              />

              {!isReadOnly && (
                <Box
                  sx={{ display: "flex", gap: 2, width: "100%", maxWidth: 400 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Save />
                      )
                    }
                    disabled={loading}
                  >
                    {loading
                      ? "Salvando..."
                      : initialData
                        ? "Atualizar"
                        : "Criar"}
                  </Button>
                </Box>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
