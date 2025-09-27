export interface Client {
  id: number;
  razaoSocial: string;
  cnpj: string;
  nomeComercial: string;
  statusId: number;
  planId: number;
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
