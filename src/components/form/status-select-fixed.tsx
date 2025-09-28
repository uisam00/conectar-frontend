import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
} from "@mui/material";

interface StatusSelectFixedProps {
  value: number;
  onChange: (statusId: number) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

// Status fixos
const STATUS_OPTIONS = [
  { id: 1, name: "Ativo", color: "success" as const },
  { id: 2, name: "Inativo", color: "error" as const },
];

export default function StatusSelectFixed({
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
}: StatusSelectFixedProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(event.target.value);
    onChange(selectedValue);
  };

  return (
    <FormControl fullWidth disabled={disabled} error={error}>
      <InputLabel>Status</InputLabel>
      <Select
        value={value || ""}
        onChange={handleSelectChange}
        label="Status"
        renderValue={(selected) => {
          const selectedStatus = STATUS_OPTIONS.find(
            (status) => status.id === selected
          );
          return selectedStatus ? selectedStatus.name : "";
        }}
      >
        {STATUS_OPTIONS.map((status) => (
          <MenuItem key={status.id} value={status.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {status.name}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography
          variant="caption"
          color={error ? "error" : "text.secondary"}
          sx={{ mt: 0.5, ml: 1.5 }}
        >
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
}
