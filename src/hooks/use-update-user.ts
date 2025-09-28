import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/api/users";
import useSnackbar from "@/hooks/use-snackbar";

interface UpdateUserData {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  photo?: {
    id: string;
  };
  role?: {
    id: number;
  };
  status?: {
    id: number;
  };
  clientRoles?: Array<{
    clientId: number;
    clientRoleId: number;
  }>;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar("Usuário atualizado com sucesso!", "success");
    },
    onError: (error: any) => {
      showSnackbar(
        error.response?.data?.message || "Erro ao atualizar usuário",
        "error"
      );
    },
  });
}
