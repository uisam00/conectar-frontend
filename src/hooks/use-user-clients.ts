import axiosInstance from "@/services/api/axios-instance";

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
  const fetchUserClients = async (): Promise<UserClientsResponse> => {
    const language = localStorage.getItem("i18nextLng") || "en";
    const response = await axiosInstance.get("/v1/users/clients/me", {
      headers: {
        "x-custom-lang": language,
      },
    });
    
    return response.data;
  };

  return {
    fetchUserClients,
  };
}
