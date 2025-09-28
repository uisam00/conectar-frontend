export interface Status {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusResponse {
  data: Status[];
  total: number;
}

import axiosInstance from "./axios-instance";

export async function getStatuses(): Promise<StatusResponse> {
  const language = localStorage.getItem("i18nextLng") || "en";
  
  const response = await axiosInstance.get("/v1/statuses", {
    headers: {
      "x-custom-lang": language,
    },
  });

  return response.data;
}
