import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Add, Business } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { getClientRoles } from "@/services/api/client-roles";
import ClientSelectWithName from "./client-select-with-name";

interface ClientRoleAssignment {
  clientId: number;
  clientRoleId: number;
  clientName: string;
  roleName: string;
}

interface ClientRoleModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (assignment: ClientRoleAssignment) => void;
  existingAssignments: ClientRoleAssignment[];
}

export default function ClientRoleModal({
  open,
  onClose,
  onAdd,
  existingAssignments,
}: ClientRoleModalProps) {
  const [selectedClient, setSelectedClient] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");
  const [error, setError] = useState<string>("");

  // Buscar roles de cliente
  const { data: clientRolesData, isLoading } = useQuery({
    queryKey: ["client-roles"],
    queryFn: getClientRoles,
    staleTime: 5 * 60 * 1000,
  });

  const clientRoles = clientRolesData?.data || [];

  const handleAdd = () => {
    setError("");

    if (!selectedClient) {
      setError("Por favor, selecione um cliente");
      return;
    }

    if (!selectedRoleId) {
      setError("Por favor, selecione uma função");
      return;
    }

    // Verificar se já existe
    const exists = existingAssignments.some(
      (assignment) => assignment.clientId === selectedClient.id
    );

    if (exists) {
      setError("Este cliente já foi adicionado");
      return;
    }

    const role = clientRoles.find((r) => r.id === selectedRoleId);
    if (!role) {
      setError("Função não encontrada");
      return;
    }

    const newAssignment: ClientRoleAssignment = {
      clientId: selectedClient.id,
      clientRoleId: selectedRoleId as number,
      clientName: selectedClient.name,
      roleName: role.name,
    };

    onAdd(newAssignment);
    handleClose();
  };

  const handleClose = () => {
    setSelectedClient(null);
    setSelectedRoleId("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 1,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Business sx={{ color: "primary.main" }} />
        Adicionar Cliente e Função
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Selecione um cliente e defina a função que o usuário terá neste
          cliente.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {open && (
            <ClientSelectWithName
              value={selectedClient?.id || ""}
              onChange={setSelectedClient}
              label="Cliente"
              enabled={true}
            />
          )}

          <FormControl fullWidth>
            <InputLabel>Função no Cliente</InputLabel>
            <Select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value as number)}
              label="Função no Cliente"
              disabled={isLoading}
            >
              {isLoading ? (
                <MenuItem disabled>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    Carregando funções...
                  </Box>
                </MenuItem>
              ) : (
                clientRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Box>
                      <Typography sx={{ fontWeight: "medium" }}>
                        {role.name}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                      >
                        {role.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {selectedClient && selectedRoleId && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Prévia da Atribuição:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Business sx={{ color: "primary.main" }} />
                <Typography sx={{ fontWeight: "medium" }}>
                  {selectedClient.name}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>→</Typography>
                <Typography sx={{ fontWeight: "medium" }}>
                  {clientRoles.find((r) => r.id === selectedRoleId)?.name}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 100 }}>
          Cancelar
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          startIcon={<Add />}
          disabled={!selectedClient || !selectedRoleId}
          sx={{ minWidth: 120 }}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
