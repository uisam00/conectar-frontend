import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getClients } from "@/services/api/clients-api";
import { useLanguage } from "@/services/i18n";

interface Client {
  id: number;
  razaoSocial: string;
  nomeComercial?: string;
  cnpj: string;
}

interface ClientSelectWithNameProps {
  value: number | string;
  onChange: (client: { id: number; name: string } | null) => void;
  disabled?: boolean;
  label?: string;
  enabled?: boolean;
}

export default function ClientSelectWithName({
  value,
  onChange,
  disabled = false,
  label = "Cliente",
  enabled = true,
}: ClientSelectWithNameProps) {
  const { t } = useLanguage("usersAdminPanel");

  const {
    data: clientsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["clients", "select-with-name"],
    queryFn: ({ pageParam = 1 }) => getClients({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / 10);
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });

  const allClients = clientsData?.pages?.flatMap((page) => page.data) || [];

  const handleChange = (event: SelectChangeEvent<number | string>) => {
    const selectedValue = event.target.value;
    if (selectedValue === "" || selectedValue === 0) {
      onChange(null);
    } else {
      const client = allClients.find(c => c.id === selectedValue);
      if (client) {
        onChange({ id: client.id, name: client.razaoSocial });
      }
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        input={
          <OutlinedInput 
            label={label} 
            endAdornment={
              isFetchingNextPage ? (
                <CircularProgress size={20} />
              ) : undefined
            }
          />
        }
        MenuProps={{
          PaperProps: {
            style: { maxHeight: 300 },
            onScroll: handleScroll,
          },
        }}
      >
        {allClients.length === 0 ? (
          <MenuItem disabled>{t("filters.client.loading")}</MenuItem>
        ) : (
          allClients.map((client: Client) => (
            <MenuItem key={client.id} value={client.id}>
              <Box>
                <Typography sx={{ fontWeight: "medium" }}>
                  {client.razaoSocial}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                >
                  {client.cnpj}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
        {isFetchingNextPage && (
          <Box sx={{ position: "relative" }}>
            <LinearProgress
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
              }}
            />
          </Box>
        )}
      </Select>
    </FormControl>
  );
}
