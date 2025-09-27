import { useState } from "react";
import axiosInstance from "@/services/api/axios-instance";
import { FILES_UPLOAD_URL } from "@/services/api/config";
import useSnackbar from "./use-snackbar";

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onSuccess?: (file: any) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ["image/"], onSuccess, onError } = options;
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { showError: showSnackbar } = useSnackbar();

  const uploadFile = async (file: File) => {
    // Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.startsWith(type))) {
      const error = "Tipo de arquivo não permitido";
      onError?.(error);
      showSnackbar(error);
      return null;
    }

    // Validate file size
    if (file.size > maxSize) {
      const error = `O arquivo deve ter no máximo ${Math.round(maxSize / 1024 / 1024)}MB`;
      onError?.(error);
      showSnackbar(error);
      return null;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(FILES_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSnackbar("Arquivo enviado com sucesso!");
      onSuccess?.(response.data.file);
      return response.data.file;
    } catch (error) {
      console.error("File upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao enviar arquivo. Tente novamente.";
      onError?.(errorMessage);
      showSnackbar(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const resetPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  return {
    uploading,
    preview,
    uploadFile,
    resetPreview,
  };
}
