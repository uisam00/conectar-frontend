import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Button,
  Alert,
} from "@mui/material";
import { Business, Add, Clear, CheckCircle, Person } from "@mui/icons-material";
import ClientRoleModal from "./client-role-modal";

interface ClientRoleAssignment {
  clientId: number;
  clientRoleId: number;
  clientName: string;
  roleName: string;
}

interface ClientRoleSelectorProps {
  value: ClientRoleAssignment[];
  onChange: (assignments: ClientRoleAssignment[]) => void;
  disabled?: boolean;
}

export default function ClientRoleSelector({
  value,
  onChange,
  disabled = false,
}: ClientRoleSelectorProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddAssignment = (assignment: ClientRoleAssignment) => {
    onChange([...value, assignment]);
  };

  const handleRemoveAssignment = (clientId: number) => {
    onChange(value.filter((assignment) => assignment.clientId !== clientId));
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return "error";
      case "manager":
        return "warning";
      case "user":
        return "info";
      default:
        return "default";
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return <CheckCircle />;
      case "manager":
        return <Person />;
      case "user":
        return <Person />;
      default:
        return <Person />;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Business sx={{ fontSize: 20 }} />
        Clientes e Funções
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Selecione os clientes e defina a função do usuário em cada um deles.
      </Typography>

      {/* Lista de atribuições atuais */}
      {value.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
            Atribuições atuais ({value.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {value.map((assignment) => (
              <Card
                key={assignment.clientId}
                sx={{
                  border: "1px solid #e0e0e0",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <Business />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {assignment.clientName}
                        </Typography>
                        <Chip
                          icon={getRoleIcon(assignment.roleName)}
                          label={assignment.roleName}
                          color={getRoleColor(assignment.roleName) as any}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() =>
                        handleRemoveAssignment(assignment.clientId)
                      }
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "error.light",
                          color: "white",
                        },
                      }}
                      size="small"
                    >
                      <Clear />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Botão para abrir modal */}
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() => setModalOpen(true)}
        disabled={disabled}
        sx={{
          borderStyle: "dashed",
          borderWidth: 2,
          py: 1.5,
          "&:hover": {
            borderStyle: "solid",
            backgroundColor: "primary.light",
            color: "white",
          },
        }}
      >
        Adicionar Cliente e Função
      </Button>

      {value.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhum cliente selecionado. O usuário será criado apenas com a função
          do sistema.
        </Alert>
      )}

      {/* Modal para adicionar cliente e função */}
      {modalOpen && (
        <ClientRoleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleAddAssignment}
          existingAssignments={value}
        />
      )}
    </Box>
  );
}
