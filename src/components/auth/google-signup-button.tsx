import { useEffect, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useGoogleSignup } from "@/hooks/use-google-signup";

interface GoogleSignupButtonProps {
  onLoadingChange?: (loading: boolean) => void;
  disabled?: boolean;
}

export default function GoogleSignupButton({
  onLoadingChange,
  disabled = false,
}: GoogleSignupButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { isLoading, isGoogleLoaded, renderGoogleSignupButton } =
    useGoogleSignup();

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    if (isGoogleLoaded && buttonRef.current && !disabled) {
      renderGoogleSignupButton("google-signup-button");
    }
  }, [isGoogleLoaded, renderGoogleSignupButton, disabled]);

  if (!isGoogleLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          border: "1px solid #dadce0",
          borderRadius: 1,
          backgroundColor: "#fff",
          minHeight: 40,
        }}
      >
        <CircularProgress size={20} />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Carregando Google...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <div
        id="google-signup-button"
        ref={buttonRef}
        style={{
          width: "100%",
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      />
    </Box>
  );
}
