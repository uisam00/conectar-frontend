export interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  isSpecial?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlansResponse {
  data: Plan[];
  total: number;
}

import axiosInstance from "./axios-instance";

export async function getPlans(): Promise<PlansResponse> {
  const language = localStorage.getItem("i18nextLng") || "en";
  
  const response = await axiosInstance.get("/v1/plans", {
    headers: {
      "x-custom-lang": language,
    },
  });

  return response.data;
}
