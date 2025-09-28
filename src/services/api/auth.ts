import axiosInstance from './axios-instance';

export interface ConfirmEmailRequest {
  hash: string;
}

export interface ConfirmEmailResponse {
  message?: string;
}

export const authApi = {
  /**
   * Confirma o email do usuário usando o hash recebido por email
   */
  confirmEmail: async (data: ConfirmEmailRequest): Promise<ConfirmEmailResponse> => {
    const response = await axiosInstance.post('/v1/auth/email/confirm', data);
    return response.data;
  },

  /**
   * Confirma novo email do usuário usando o hash recebido por email
   */
  confirmNewEmail: async (data: ConfirmEmailRequest): Promise<ConfirmEmailResponse> => {
    const response = await axiosInstance.post('/v1/auth/email/confirm', data);
    return response.data;
  },
};
