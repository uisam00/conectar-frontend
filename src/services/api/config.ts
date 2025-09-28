export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const AUTH_ME_URL = "/v1/auth/me";
export const AUTH_LOGIN_URL = "/v1/auth/email/login";
export const AUTH_REGISTER_URL = "/v1/auth/email/register";
export const AUTH_CONFIRM_EMAIL_URL = "/v1/auth/email/confirm";
export const AUTH_CONFIRM_NEW_EMAIL_URL = "/v1/auth/email/confirm/new";
export const AUTH_FORGOT_PASSWORD_URL = "/v1/auth/forgot/password";
export const AUTH_RESET_PASSWORD_URL = "/v1/auth/reset/password";
export const AUTH_REFRESH_URL = "/v1/auth/refresh";
export const AUTH_LOGOUT_URL = "/v1/auth/logout";
export const AUTH_GOOGLE_LOGIN_URL = "/v1/auth/google/login";
export const AUTH_UPDATE_URL = "/v1/auth/me";

export const USERS_URL = "/v1/users";
export const FILES_UPLOAD_URL = "/v1/files/upload";

export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HTTP_CODES_ENUM = (typeof HTTP_CODES)[keyof typeof HTTP_CODES];
