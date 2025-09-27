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
  statusId?: number;
  planId?: number;
  isSpecial?: boolean;
  page?: number;
  limit?: number;
}

import { getTokensInfo } from "../auth/auth-tokens-info";
import { API_URL } from "./config";

export async function getClients(filters: ClientsFilters = {}): Promise<ClientsResponse> {
  const queryParams = new URLSearchParams();
  
  if (filters.search) queryParams.append("search", filters.search.trim());
  if (filters.name) queryParams.append("name", filters.name.trim());
  if (filters.statusId) queryParams.append("statusId", filters.statusId.toString());
  if (filters.planId) queryParams.append("planId", filters.planId.toString());
  if (filters.isSpecial !== undefined) queryParams.append("isSpecial", filters.isSpecial.toString());
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());

  const queryString = queryParams.toString();
  const url = `/v1/clients${queryString ? `?${queryString}` : ""}`;

  const tokens = getTokensInfo();
  const language = localStorage.getItem("i18nextLng") || "en";

  const response = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-custom-lang": language,
      ...(tokens?.token && {
        Authorization: `Bearer ${tokens.token}`,
      }),
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar clientes: ${response.status}`);
  }

  return response.json();
}
