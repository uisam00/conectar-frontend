export interface ApiError {
  [key: string]: string;
}

const errorMappings: Record<string, string> = {
  "email.notFound": "inputs.email.validation.server.notFound",
  "email.emailNotExists": "inputs.email.validation.server.emailNotExists",
  "email.emailAlreadyExists":
    "inputs.email.validation.server.emailAlreadyExists",
  "email.invalid": "inputs.email.validation.invalid",
  "email.required": "inputs.email.validation.required",
  "password.incorrectPassword":
    "inputs.password.validation.server.incorrectPassword",
  "password.required": "inputs.password.validation.required",
  "password.min": "inputs.password.validation.min",
  "password.invalid": "inputs.password.validation.server.incorrectPassword",
  "firstName.required": "inputs.firstName.validation.required",
  "lastName.required": "inputs.lastName.validation.required",
  "policy.required": "inputs.policy.validation.required",
  "user.notFound": "errors.userNotFound",
  "auth.invalidCredentials": "errors.invalidCredentials",
  "auth.unauthorized": "errors.unauthorized",
  "auth.forbidden": "errors.forbidden",
  "server.error": "errors.serverError",
  "network.error": "errors.networkError",
};

export function getErrorTranslationKey(error: ApiError): string {
  for (const [field, errorCode] of Object.entries(error)) {
    const translationKey =
      errorMappings[`${field}.${errorCode}`] ||
      errorMappings[errorCode] ||
      errorMappings[field];

    if (translationKey) {
      return translationKey;
    }
  }

  return "errors.generic";
}

export function getFieldErrorTranslationKey(
  error: ApiError,
  field: string
): string | undefined {
  const fieldError = error[field];
  if (!fieldError) return undefined;

  return getErrorTranslationKey({ [field]: fieldError });
}
