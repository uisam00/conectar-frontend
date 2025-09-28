import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getClientRoles } from "@/services/api/client-roles";

interface ClientRole {
  id: number;
  name: string;
  description: string;
}

interface ClientRoleSelectProps {
  value: number | string;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  enabled?: boolean;
}

export default function ClientRoleSelect({
  value,
  onChange,
  disabled = false,
  label = "Role do Cliente",
  enabled = true,
}: ClientRoleSelectProps) {
  const {
    data: clientRolesData,
    isLoading,
  } = useQuery({
    queryKey: ["client-roles"],
    queryFn: getClientRoles,
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled,
  });

  const handleChange = (event: SelectChangeEvent<number | string>) => {
    const selectedValue = event.target.value;
    if (selectedValue === "" || selectedValue === 0) {
      onChange(0);
    } else if (typeof selectedValue === "string") {
      onChange(parseInt(selectedValue));
    } else {
      onChange(selectedValue);
    }
  };

  const clientRoles = clientRolesData?.data || [];

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
      >
        {isLoading ? (
          <MenuItem disabled>Carregando...</MenuItem>
        ) : (
          clientRoles.map((role: ClientRole) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
