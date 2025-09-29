import axiosInstance from "@/services/api/axios-instance";
import { AUTH_GOOGLE_LOGIN_URL } from "@/services/api/config";
import type { User } from "@/types/api";

export interface GoogleAuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface GoogleLoginRequest {
  idToken: string;
}

/**
 * Realiza login com Google usando o token de credencial
 */
export async function loginWithGoogle(idToken: string): Promise<GoogleAuthResponse> {
  try {
    const response = await axiosInstance.post<GoogleAuthResponse>(
      AUTH_GOOGLE_LOGIN_URL,
      { idToken } as GoogleLoginRequest
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Inicializa o Google Identity Services
 */
export function initializeGoogleAuth(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Auth só pode ser inicializado no cliente'));
      return;
    }

    // Verifica se o script do Google já foi carregado
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    // Carrega o script do Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && window.google.accounts) {
        resolve();
      } else {
        reject(new Error('Falha ao carregar Google Identity Services'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Erro ao carregar script do Google'));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Configura o botão de login do Google
 */
export function renderGoogleButton(
  elementId: string,
  onSuccess: (idToken: string) => void,
  onError: (error: string) => void
): void {
  if (!window.google || !window.google.accounts) {
    onError('Google Identity Services não foi carregado');
    return;
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!clientId || clientId === 'your-google-client-id-here') {
    onError('Google Client ID não configurado. Configure VITE_GOOGLE_CLIENT_ID no arquivo .env');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: any) => {
      if (response.credential) {
        // O Google retorna um JWT que contém o idToken
        // Vamos extrair o idToken do JWT ou usar o credential diretamente
        onSuccess(response.credential);
      } else {
        onError('Token do Google não recebido');
      }
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  window.google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
      logo_alignment: 'left',
    }
  );
}

// Extensão do tipo Window para incluir Google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}
