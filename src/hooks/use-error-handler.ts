import { useCallback } from "react";
import { useLanguage } from "@/services/i18n";
import useSnackbar from "./use-snackbar";
import {
  getErrorTranslationKey,
  getFieldErrorTranslationKey,
} from "@/services/helpers/error-mapper";

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

  const handleApiError = useCallback(
    (error: unknown) => {
      let errorMessage = tCommon("errors.generic");

      if (error && typeof error === "object") {
        if (Object.keys(error).length > 0) {
          const translationKey = getErrorTranslationKey(error);
          errorMessage = translateError(translationKey);
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      showError(errorMessage);
    },
    [showError, translateError, tCommon]
  );

  const handleFieldError = useCallback(
    (error: unknown, field: string) => {
      if (error && typeof error === "object") {
        const translationKey = getFieldErrorTranslationKey(error, field);
        if (translationKey) {
          return translateError(translationKey);
        }
      }
      return undefined;
    },
    [translateError]
  );

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
