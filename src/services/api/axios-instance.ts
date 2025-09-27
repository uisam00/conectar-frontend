import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { getTokensInfo, setTokensInfo } from '../auth/auth-tokens-info';

// Fila de requisições pendentes durante o refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Função para processar a fila de requisições
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Instância do axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição para adicionar o token
axiosInstance.interceptors.request.use(
  (config: any) => {
    const tokens = getTokensInfo();
    if (tokens?.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${tokens.token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros 401
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está fazendo refresh, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = getTokensInfo();
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        // Tentar fazer refresh do token
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/v1/auth/refresh`,
          { refreshToken: tokens.refreshToken }
        );

        const { token, refreshToken } = response.data;
        
        // Atualizar tokens
        setTokensInfo({
          token,
          refreshToken,
          tokenExpires: Math.floor(Date.now() / 1000) + 3600, // 1 hora
        });

        // Processar fila de requisições pendentes
        processQueue(null, token);

        // Retry da requisição original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Se o refresh falhou, limpar tokens e redirecionar para login
        processQueue(refreshError, null);
        setTokensInfo(null);
        
        // Redirecionar para login
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
