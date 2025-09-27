import { forwardRef } from "react";
import { TextField, Typography, Box } from "@mui/material";

interface LabelInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  endAdornment?: React.ReactNode;
  id?: string;
  sx?: object;
}

const LabelInput = forwardRef<HTMLDivElement, LabelInputProps>(
  (
    {
      label,
      name,
      type = "text",
      value,
      onChange,
      required = false,
      autoComplete,
      autoFocus = false,
      fullWidth = true,
      error = false,
      helperText,
      endAdornment,
      id,
      sx = {},
    },
    ref
  ) => {
    return (
      <Box sx={{ mb: 2, ...sx }}>
        <Typography variant="body2" sx={{ mb: 0.5, color: "#333" }}>
          {label}
        </Typography>
        <TextField
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          fullWidth={fullWidth}
          error={error}
          helperText={helperText}
          InputProps={{
            endAdornment,
          }}
        />
      </Box>
    );
  }
);

LabelInput.displayName = "LabelInput";

export default LabelInput;
