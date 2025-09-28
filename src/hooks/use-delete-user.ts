import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/services/api/users";
import useSnackbar from "@/hooks/use-snackbar";
import { useNavigate } from "react-router-dom";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar("Usuário excluído com sucesso!", "success");
      navigate("/admin/users");
    },
    onError: (error: any) => {
      showSnackbar(
        error.response?.data?.message || "Erro ao excluir usuário",
        "error"
      );
    },
  });
}
