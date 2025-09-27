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
  deletedAt: string | null;
}

export interface UserClientsResponse {
  clients: Client[];
  userRole: any;
}

export function useUserClients() {
  const fetch = useFetch();

  const fetchUserClients = async (): Promise<UserClientsResponse> => {
    const response = await fetch("/v1/users/clients/me");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  return {
    fetchUserClients,
  };
}
