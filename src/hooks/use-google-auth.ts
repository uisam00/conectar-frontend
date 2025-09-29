import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '@/hooks';
import { useAuthActions } from '@/services/auth';
import { 
  initializeGoogleAuth, 
  renderGoogleButton, 
  loginWithGoogle 
} from '@/services/auth/google-auth';

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { showSuccess, showError } = useSnackbar();
  const { setTokensInfo } = useAuthActions();
  const navigate = useNavigate();

  // Inicializa o Google Auth quando o componente monta
  useEffect(() => {
    const initGoogle = async () => {
      try {
        await initializeGoogleAuth();
        setIsGoogleLoaded(true);
      } catch (error) {
        console.error('Erro ao inicializar Google Auth:', error);
        showError('Erro ao carregar autenticação Google');
      }
    };

    initGoogle();
  }, [showError]);

  const handleGoogleSuccess = useCallback(async (credential: string) => {
    setIsLoading(true);
    
    try {
      const response = await loginWithGoogle(credential);
      
      // Salva os tokens
      setTokensInfo({
        token: response.accessToken,
        refreshToken: response.refreshToken,
        tokenExpires: response.tokenExpires,
      });
      
      showSuccess('Login realizado com sucesso!');
      navigate('/');
      
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      showError(
        error.response?.data?.message || 
        'Erro ao fazer login com Google. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [setTokensInfo, showSuccess, showError, navigate]);

  const handleGoogleError = useCallback((error: string) => {
    console.error('Erro do Google:', error);
    showError(`Erro na autenticação Google: ${error}`);
  }, [showError]);

  const renderGoogleLoginButton = useCallback((elementId: string) => {
    if (!isGoogleLoaded) {
      return;
    }

    try {
      renderGoogleButton(elementId, handleGoogleSuccess, handleGoogleError);
    } catch (error) {
      console.error('Erro ao renderizar botão Google:', error);
      showError('Erro ao carregar botão de login Google');
    }
  }, [isGoogleLoaded, handleGoogleSuccess, handleGoogleError, showError]);

  return {
    isLoading,
    isGoogleLoaded,
    renderGoogleLoginButton,
  };
}
