import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/api/clients-api";
import useSnackbar from "@/hooks/use-snackbar";
import { useNavigate } from "react-router-dom";

export function useCreateClient() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      // Resetar todas as queries relacionadas a clientes
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client"] });
      
      showSnackbar("Cliente criado com sucesso!", "success");
      
      // Redirecionar para a tela de visualização do cliente criado
      navigate(`/admin/clients/${data.id}`);
    },
    onError: (error: any) => {
      showSnackbar(
        error.response?.data?.message || "Erro ao criar cliente",
        "error"
      );
    },
  });
}
