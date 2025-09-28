import axiosInstance from "./axios-instance";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
  status?: {
    id: number;
    name: string;
  };
  photo?: {
    id: number;
    path: string;
  };
  clients?: Array<{
    id: number;
    razaoSocial: string;
    nomeComercial: string;
    cnpj: string;
    clientRoleId: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  data: User[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

export interface UsersFilters {
  search?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: number;
  statusId?: number;
  clientId?: number;
  systemRoleId?: number;
  clientRoleId?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export async function getUsers(filters: UsersFilters = {}): Promise<UsersResponse> {
  const queryParams = new URLSearchParams();
  
  if (filters.search) queryParams.append("search", filters.search.trim());
  if (filters.firstName) queryParams.append("firstName", filters.firstName.trim());
  if (filters.lastName) queryParams.append("lastName", filters.lastName.trim());
  if (filters.email) queryParams.append("email", filters.email.trim());
  if (filters.roleId) queryParams.append("roleId", filters.roleId.toString());
  if (filters.statusId) queryParams.append("statusId", filters.statusId.toString());
  if (filters.clientId) queryParams.append("clientId", filters.clientId.toString());
  if (filters.systemRoleId) queryParams.append("systemRoleId", filters.systemRoleId.toString());
  if (filters.clientRoleId) queryParams.append("clientRoleId", filters.clientRoleId.toString());
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const queryString = queryParams.toString();
  const url = `/v1/users${queryString ? `?${queryString}` : ""}`;

  const language = localStorage.getItem("i18nextLng") || "en";
  const response = await axiosInstance.get(url, {
    headers: {
      "x-custom-lang": language,
    },
  });
  return response.data;
}
