import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClient } from "@/services/api/clients-api";
import useSnackbar from "@/hooks/use-snackbar";
import { useNavigate } from "react-router-dom";

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: number) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      showSnackbar("Cliente excluído com sucesso!", "success");
      navigate("/admin/clients");
    },
    onError: (error: any) => {
      showSnackbar(
        error.response?.data?.message || "Erro ao excluir cliente",
        "error"
      );
    },
  });
}
