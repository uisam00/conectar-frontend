import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { getTokensInfo, setTokensInfo } from '../auth/auth-tokens-info';
import { AUTH_REFRESH_URL } from './config';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

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

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const tokens = getTokensInfo();
    if (tokens) {
      const isExpired = Date.now() >= tokens.tokenExpires * 1000;
      if (!isExpired && tokens.token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${tokens.token}`,
        };
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers && token) {
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

        const response = await axios.post(AUTH_REFRESH_URL, {}, {
          headers: {
            'Authorization': `Bearer ${tokens.refreshToken}`,
            'Content-Type': 'application/json',
          }
        });

        const { token, refreshToken, tokenExpires } = (response.data as any);
        
        setTokensInfo({
          token,
          refreshToken: refreshToken || tokens.refreshToken,
          tokenExpires: tokenExpires || Math.floor(Date.now() / 1000) + 3600,
        });

        processQueue(null, token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return axiosInstance(originalRequest);

      } catch (refreshError: any) {
        processQueue(refreshError, null);
        setTokensInfo(null);
        
        // Only redirect if it's not already a login page request
        if (!originalRequest.url?.includes('/sign-in') && !originalRequest.url?.includes('/auth/')) {
          window.location.href = '/sign-in';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
