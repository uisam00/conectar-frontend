import { useCallback } from "react";
import { useLanguage } from "@/services/i18n";
import useSnackbar from "./use-snackbar";
import {
  getErrorTranslationKey,
  getFieldErrorTranslationKey,
  type ApiError,
} from "@/services/helpers/error-mapper";

/**
 * Hook para tratamento de erros da API com tradução automática
 * @returns Objeto com funções para tratamento de erros
 */
export default function useErrorHandler() {
  const { showError, showSuccess } = useSnackbar();
  const { t: tCommon } = useLanguage("common");
  const { t: tSignIn } = useLanguage("sign-in");
  const { t: tSignUp } = useLanguage("sign-up");
  const { t: tForgotPassword } = useLanguage("forgot-password");

  const translateError = useCallback(
    (translationKey: string) => {
      if (translationKey.startsWith("inputs.")) {
        return (
          tSignIn(translationKey) ||
          tSignUp(translationKey) ||
          tForgotPassword(translationKey) ||
          tCommon(translationKey)
        );
      } else if (translationKey.startsWith("errors.")) {
        return tCommon(translationKey);
      }
      return tCommon(translationKey);
    },
    [tCommon, tSignIn, tSignUp, tForgotPassword]
  );

  /**
   * Trata erros da API e exibe mensagem traduzida
   * @param error - Erro a ser tratado
   */
  const handleApiError = useCallback(
    (error: unknown) => {
      let errorMessage = tCommon("errors.generic");

      if (error && typeof error === "object" && error !== null) {
        // Verifica se é um erro com propriedades
        if (Object.keys(error).length > 0) {
          const translationKey = getErrorTranslationKey(error as ApiError);
          errorMessage = translateError(translationKey);
        } 
        // Verifica se tem propriedade message
        else if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        }
        // Verifica se é um Error object
        else if (error instanceof Error && error.message) {
          errorMessage = error.message;
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      showError(errorMessage);
    },
    [showError, translateError, tCommon]
  );

  /**
   * Trata erros de campo específico e retorna mensagem traduzida
   * @param error - Erro a ser tratado
   * @param field - Nome do campo com erro
   * @returns Mensagem de erro traduzida ou undefined
   */
  const handleFieldError = useCallback(
    (error: unknown, field: string) => {
      if (error && typeof error === "object" && error !== null) {
        const translationKey = getFieldErrorTranslationKey(error as ApiError, field);
        if (translationKey) {
          return translateError(translationKey);
        }
      }
      return undefined;
    },
    [translateError]
  );

  /**
   * Exibe mensagem de sucesso
   * @param message - Mensagem de sucesso a ser exibida
   */
  const handleSuccess = useCallback(
    (message: string) => {
      showSuccess(message);
    },
    [showSuccess]
  );

  return {
    handleApiError,
    handleFieldError,
    handleSuccess,
  };
}
