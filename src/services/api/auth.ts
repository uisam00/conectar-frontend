import axiosInstance from './axios-instance';

export interface ConfirmEmailRequest {
  hash: string;
}

export interface ConfirmEmailResponse {
  message?: string;
}

export const authApi = {
  confirmEmail: async (data: ConfirmEmailRequest): Promise<ConfirmEmailResponse> => {
    const response = await axiosInstance.post('/v1/auth/email/confirm', data);
    return response.data;
  },

  confirmNewEmail: async (data: ConfirmEmailRequest): Promise<ConfirmEmailResponse> => {
    const response = await axiosInstance.post('/v1/auth/email/confirm', data);
    return response.data;
  },
};
