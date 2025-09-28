export interface User {
  id: number;
  email: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  photo: FileType | null;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FileType {
  id: string;
  path: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  photo?: FileDto;
  role?: RoleDto;
  status?: StatusDto;
  clientRoles?: { clientId: number; clientRoleId: number }[];
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  photo?: FileDto;
  role?: RoleDto;
  status?: StatusDto;
}

export interface FileDto {
  id: string;
}

export interface RoleDto {
  id: number;
}

export interface StatusDto {
  id: number;
}

export interface InfinityPaginationUserResponseDto {
  data: User[];
  hasNextPage: boolean;
}

export interface FileResponseDto {
  file: FileType;
}

export interface AuthEmailLoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
}

export interface AuthRegisterLoginDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthConfirmEmailDto {
  hash: string;
}

export interface AuthForgotPasswordDto {
  email: string;
}

export interface AuthResetPasswordDto {
  password: string;
  hash: string;
}

export interface RefreshResponseDto {
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface AuthUpdateDto {
  photo?: FileDto;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
}

export interface AuthGoogleLoginDto {
  idToken: string;
}
