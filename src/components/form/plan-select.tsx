import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { usePlansQuery } from "@/hooks/use-plans-query";

// Função auxiliar para formatar preço
const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined || price === null) return "0,00";

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) return "0,00";

  return numericPrice.toFixed(2);
};

interface PlanSelectProps {
  value: number;
  onChange: (planId: number) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function PlanSelect({
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
}: PlanSelectProps) {
  const { data: plansData, isLoading, error: queryError } = usePlansQuery();

  if (isLoading) {
    return (
      <FormControl fullWidth disabled>
        <InputLabel>Plano</InputLabel>
        <Select value="" label="Plano">
          <MenuItem disabled>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2">Carregando planos...</Typography>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    );
  }

  if (queryError || !plansData?.data) {
    return (
      <FormControl fullWidth disabled error>
        <InputLabel>Plano</InputLabel>
        <Select value="" label="Plano">
          <MenuItem disabled>
            <Typography variant="body2" color="error">
              Erro ao carregar planos
            </Typography>
          </MenuItem>
        </Select>
      </FormControl>
    );
  }

  const plans = plansData.data;

  return (
    <FormControl fullWidth disabled={disabled} error={error}>
      <InputLabel>Plano</InputLabel>
      <Select
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        label="Plano"
        renderValue={(selected) => {
          const selectedPlan = plans.find((plan) => plan.id === selected);
          return selectedPlan ? selectedPlan.name : "";
        }}
      >
        {plans.map((plan) => (
          <MenuItem key={plan.id} value={plan.id}>
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
                  {plan.name}
                </Typography>
                {plan.description && (
                  <Typography variant="body2" color="text.secondary">
                    {plan.description}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {plan.isSpecial && (
                  <Chip
                    label="Especial"
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                )}
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{ fontWeight: "medium" }}
                >
                  R$ {formatPrice(plan.price)}
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
