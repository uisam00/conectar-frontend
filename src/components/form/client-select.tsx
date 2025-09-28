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

interface ClientSelectProps {
  value: number | number[] | string;
  onChange: (value: number | number[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
}

export default function ClientSelect({
  value,
  onChange,
  disabled = false,
  multiple = false,
  label = "Clientes",
}: ClientSelectProps) {
  const { t } = useLanguage("usersAdminPanel");

  const {
    data: clientsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["clients", "select"],
    queryFn: ({ pageParam = 1 }) => getClients({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / 10);
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const allClients = clientsData?.pages?.flatMap((page) => page.data) || [];

  const handleChange = (event: SelectChangeEvent<number | number[]>) => {
    const selectedValue = event.target.value;
    if (typeof selectedValue === "string") {
      onChange(parseInt(selectedValue));
    } else {
      onChange(selectedValue);
    }
  };

  const handleRemoveClient = (clientId: number) => {
    if (multiple && Array.isArray(value)) {
      const newValue = value.filter((id) => id !== clientId);
      onChange(newValue);
    }
  };

  const selectedClients = allClients.filter((client) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(client.id);
    }
    return client.id === (typeof value === "string" ? parseInt(value) : value);
  });

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
        multiple={multiple}
        value={value}
        onChange={handleChange}
        input={
          <OutlinedInput
            label={label}
            endAdornment={
              isFetchingNextPage ? <CircularProgress size={20} /> : undefined
            }
          />
        }
        renderValue={() => {
          if (multiple && Array.isArray(value)) {
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selectedClients.map((client) => (
                  <Chip
                    key={client.id}
                    label={client.razaoSocial}
                    onDelete={() => handleRemoveClient(client.id)}
                    size="small"
                  />
                ))}
              </Box>
            );
          }
          return selectedClients[0]?.razaoSocial || "";
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
            onScroll: handleScroll,
          },
        }}
      >
        {allClients.length === 0 ? (
          <MenuItem disabled>{t("filters.client.loading")}</MenuItem>
        ) : (
          allClients.map((client: Client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.razaoSocial}
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
