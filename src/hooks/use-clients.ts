import { useState, useEffect } from "react";
import useFetch from "@/services/api/use-fetch";

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

export function useClients(filters: ClientsFilters = {}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useFetch();

  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.name) queryParams.append("name", filters.name);
      if (filters.statusId) queryParams.append("statusId", filters.statusId.toString());
      if (filters.planId) queryParams.append("planId", filters.planId.toString());
      if (filters.isSpecial !== undefined) queryParams.append("isSpecial", filters.isSpecial.toString());
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.limit) queryParams.append("limit", filters.limit.toString());

      const queryString = queryParams.toString();
      const url = `/v1/clients${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro ao buscar clientes: ${response.status}`);
      }

      const data: ClientsResponse = await response.json();
      setClients(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [filters.search, filters.name, filters.statusId, filters.planId, filters.isSpecial, filters.page, filters.limit]);

  return {
    clients,
    total,
    loading,
    error,
    refetch: fetchClients,
  };
}
