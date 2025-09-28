export interface Client {
  id: number;
  razaoSocial: string;
  cnpj: string;
  nomeComercial: string;
  statusId: number;
  planId: number;
  photo?: {
    id: string;
    path: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ClientsResponse {
  data: Client[];
  total: number;
}

export interface ClientsFilters {
  search?: string;
  name?: string;
  cnpj?: string;
  statusId?: number;
  planId?: number;
  isSpecial?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

import axiosInstance from "./axios-instance";

export async function getClients(filters: ClientsFilters = {}): Promise<ClientsResponse> {
  const queryParams = new URLSearchParams();
  
  if (filters.search) queryParams.append("search", filters.search.trim());
  if (filters.name) queryParams.append("name", filters.name.trim());
  if (filters.cnpj) queryParams.append("cnpj", filters.cnpj.trim());
  if (filters.statusId) queryParams.append("statusId", filters.statusId.toString());
  if (filters.planId) queryParams.append("planId", filters.planId.toString());
  if (filters.isSpecial !== undefined) queryParams.append("isSpecial", filters.isSpecial.toString());
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const queryString = queryParams.toString();
  const url = `/v1/clients${queryString ? `?${queryString}` : ""}`;

  const language = localStorage.getItem("i18nextLng") || "en";

  const response = await axiosInstance.get(url, {
    headers: {
      "x-custom-lang": language,
    },
  });

  return response.data;
}

export interface CreateClientDto {
  razaoSocial: string;
  cnpj: string;
  nomeComercial?: string;
  statusId: number;
  planId: number;
  photo?: {
    id: string;
  } | null;
}

export interface UpdateClientDto {
  razaoSocial?: string;
  cnpj?: string;
  nomeComercial?: string;
  statusId?: number;
  planId?: number;
  photo?: {
    id: string;
  } | null;
}

export async function getClientById(id: number): Promise<Client> {
  const language = localStorage.getItem("i18nextLng") || "en";
  
  const response = await axiosInstance.get(`/v1/clients/${id}`, {
    headers: {
      "x-custom-lang": language,
    },
  });

  return response.data;
}

export async function createClient(data: CreateClientDto): Promise<Client> {
  const language = localStorage.getItem("i18nextLng") || "en";
  
  const response = await axiosInstance.post("/v1/clients", data, {
    headers: {
      "x-custom-lang": language,
    },
  });

  return response.data;
}

export async function updateClient(id: number, data: UpdateClientDto): Promise<Client> {
  const language = localStorage.getItem("i18nextLng") || "en";
  
  const response = await axiosInstance.patch(`/v1/clients/${id}`, data, {
    headers: {
      "x-custom-lang": language,
    },
  });

  return response.data;
}

export async function deleteClient(id: number): Promise<void> {
  const language = localStorage.getItem("i18nextLng") || "en";
  
  await axiosInstance.delete(`/v1/clients/${id}`, {
    headers: {
      "x-custom-lang": language,
    },
  });
}

export interface ClientUser {
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
    id: string;
    path: string;
  } | null;
  clientRole?: {
    id: number;
    name: string;
    description?: string;
    permissions?: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClientUsersResponse {
  data: ClientUser[];
  total: number;
}

export interface ClientUsersFilters {
  search?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: number;
  statusId?: number;
  systemRoleId?: number;
  clientRoleId?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export async function getClientUsers(
  clientId: number, 
  filters: ClientUsersFilters = {}
): Promise<ClientUsersResponse> {
  const queryParams = new URLSearchParams();
  
  if (filters.search) queryParams.append("search", filters.search.trim());
  if (filters.firstName) queryParams.append("firstName", filters.firstName.trim());
  if (filters.lastName) queryParams.append("lastName", filters.lastName.trim());
  if (filters.email) queryParams.append("email", filters.email.trim());
  if (filters.roleId) queryParams.append("roleId", filters.roleId.toString());
  if (filters.statusId) queryParams.append("statusId", filters.statusId.toString());
  if (filters.systemRoleId) queryParams.append("systemRoleId", filters.systemRoleId.toString());
  if (filters.clientRoleId) queryParams.append("clientRoleId", filters.clientRoleId.toString());
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const queryString = queryParams.toString();
  const url = `/v1/clients/${clientId}/users${queryString ? `?${queryString}` : ""}`;

  const language = localStorage.getItem("i18nextLng") || "en";

  const response = await axiosInstance.get(url, {
    headers: {
      "x-custom-lang": language,
    },
  });

  return response.data;
}
