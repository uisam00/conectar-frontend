import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "@/services/api/clients-api";
import useSnackbar from "@/hooks/use-snackbar";
import { useNavigate } from "react-router-dom";

interface UpdateClientData {
  razaoSocial?: string;
  cnpj?: string;
  nomeComercial?: string;
  statusId?: number;
  planId?: number;
  photo?: {
    id: string;
  } | null;
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateClientData }) =>
      updateClient(id, data),
    onSuccess: (_, { id }) => {
      // Resetar todas as queries relacionadas a clientes
      queryClient.invalidateQueries({ queryKey: ["client", id] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client-users"] });
      
      showSnackbar("Cliente atualizado com sucesso!", "success");
      
      // Redirecionar para a tela de visualização do cliente editado
      navigate(`/admin/clients/${id}`);
    },
    onError: (error: any) => {
      showSnackbar(
        error.response?.data?.message || "Erro ao atualizar cliente",
        "error"
      );
    },
  });
}
