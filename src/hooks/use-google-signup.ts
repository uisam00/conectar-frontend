import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/hooks';
import { setTokensInfo } from '@/services/auth/auth-tokens-info';
import { 
  initializeGoogleAuth, 
  renderGoogleButton, 
  loginWithGoogle 
} from '@/services/auth/google-auth';

export function useGoogleSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { showSuccess, showError } = useSnackbar();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Inicializa o Google Auth quando o componente monta
  useEffect(() => {
    const initGoogle = async () => {
      try {
        await initializeGoogleAuth();
        setIsGoogleLoaded(true);
      } catch (error) {
        showError('Erro ao carregar autenticação Google');
      }
    };

    initGoogle();
  }, [showError]);

  const handleGoogleSuccess = useCallback(async (idToken: string) => {
    setIsLoading(true);
    
    try {
      const response = await loginWithGoogle(idToken);
      
      // Salva os tokens
      const tokensToSave = {
        token: response.token,
        refreshToken: response.refreshToken,
        tokenExpires: response.tokenExpires,
      };
      
      setTokensInfo(tokensToSave);
      
      // Invalidar cache do React Query para recarregar dados do usuário
      queryClient.setQueryData(["currentUser"], response.user);
      
      showSuccess('Cadastro realizado com sucesso!');
      navigate('/');
      
    } catch (error: any) {
      showError(
        error.response?.data?.message || 
        'Erro ao fazer cadastro com Google. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [setTokensInfo, showSuccess, showError, navigate, queryClient]);

  const handleGoogleError = useCallback((error: string) => {
    showError(`Erro na autenticação Google: ${error}`);
  }, [showError]);

  const renderGoogleSignupButton = useCallback((elementId: string) => {
    if (!isGoogleLoaded) {
      return;
    }

    try {
      renderGoogleButton(elementId, handleGoogleSuccess, handleGoogleError);
    } catch (error) {
      showError('Erro ao carregar botão de cadastro Google');
    }
  }, [isGoogleLoaded, handleGoogleSuccess, handleGoogleError, showError]);

  return {
    isLoading,
    isGoogleLoaded,
    renderGoogleSignupButton,
  };
}
