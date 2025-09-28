import axiosInstance from "./axios-instance";

export interface ClientRole {
  id: number;
  name: string;
  description: string;
  permissions: {
    canManageUsers: boolean;
    canViewReports: boolean;
    canManageClient: boolean;
    canManageSettings: boolean;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ClientRolesResponse {
  data: ClientRole[];
  total: number;
}

export async function getClientRoles(): Promise<ClientRolesResponse> {
  const language = localStorage.getItem("i18nextLng") || "en";
  const response = await axiosInstance.get("/v1/client-roles", {
    headers: {
      "x-custom-lang": language,
    },
  });
  return response.data;
}
