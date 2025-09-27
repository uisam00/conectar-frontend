import { Box, CircularProgress, Typography } from "@mui/material";

interface PageLoadingProps {
  message?: string;
}

export default function PageLoading({
  message = "Carregando...",
}: PageLoadingProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={48} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
