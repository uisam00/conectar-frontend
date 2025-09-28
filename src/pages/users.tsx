import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Collapse,
  Tabs,
  Tab,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { Search, ExpandLess, ExpandMore } from "@mui/icons-material";
import AdminPageLayout from "@/components/layout/admin-page-layout";
import { useUsersQuery } from "@/hooks/use-users-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getClients } from "@/services/api/clients-api";

type Order = "asc" | "desc";

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(0);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    email: searchParams.get("email") || "",
    roleId: searchParams.get("roleId") || "",
    statusId: searchParams.get("statusId") || "",
    clientId: searchParams.get("clientId") || "",
    systemRoleId: searchParams.get("systemRoleId") || "",
    clientRoleId: searchParams.get("clientRoleId") || "",
  });

  // Buscar clientes para o filtro com infinity query
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

  // Flatten all clients from all pages
  const allClients = clientsData?.pages?.flatMap((page) => page.data) || [];
  const [appliedFilters, setAppliedFilters] = useState({
    search: searchParams.get("search") || "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    email: searchParams.get("email") || "",
    roleId: searchParams.get("roleId") || "",
    statusId: searchParams.get("statusId") || "",
    clientId: searchParams.get("clientId") || "",
    systemRoleId: searchParams.get("systemRoleId") || "",
    clientRoleId: searchParams.get("clientRoleId") || "",
  });

  const [page, setPage] = useState(parseInt(searchParams.get("page") || "0"));
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(searchParams.get("limit") || "10")
  );
  const [order, setOrder] = useState<Order>(
    (searchParams.get("sortOrder")?.toLowerCase() as Order) || "asc"
  );
  const [orderBy, setOrderBy] = useState(searchParams.get("sortBy") || "");

  const updateURL = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const apiFilters = useMemo(
    () => ({
      search: appliedFilters.search,
      firstName: appliedFilters.firstName,
      lastName: appliedFilters.lastName,
      email: appliedFilters.email,
      roleId: appliedFilters.roleId
        ? parseInt(appliedFilters.roleId)
        : undefined,
      statusId: appliedFilters.statusId
        ? parseInt(appliedFilters.statusId)
        : undefined,
      clientId: appliedFilters.clientId
        ? parseInt(appliedFilters.clientId)
        : undefined,
      systemRoleId: appliedFilters.systemRoleId
        ? parseInt(appliedFilters.systemRoleId)
        : undefined,
      clientRoleId: appliedFilters.clientRoleId
        ? parseInt(appliedFilters.clientRoleId)
        : undefined,
      page: page + 1,
      limit: rowsPerPage,
      sortBy: orderBy || undefined,
      sortOrder: orderBy
        ? order === "asc"
          ? ("ASC" as const)
          : ("DESC" as const)
        : undefined,
    }),
    [appliedFilters, page, rowsPerPage, orderBy, order]
  );

  const { data: usersData, isLoading, error } = useUsersQuery(apiFilters);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(0);
    updateURL({
      ...filters,
      page: 0,
      limit: rowsPerPage,
      sortBy: orderBy,
      sortOrder: order,
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
      statusId: "",
      clientId: "",
      systemRoleId: "",
      clientRoleId: "",
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    setPage(0);
    updateURL({
      ...clearedFilters,
      page: 0,
      limit: rowsPerPage,
      sortBy: orderBy,
      sortOrder: order,
    });
  };

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);
    updateURL({
      ...appliedFilters,
      page: 0,
      limit: rowsPerPage,
      sortBy: property,
      sortOrder: newOrder,
    });
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    updateURL({
      ...appliedFilters,
      page: newPage,
      limit: rowsPerPage,
      sortBy: orderBy,
      sortOrder: order,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    updateURL({
      ...appliedFilters,
      page: 0,
      limit: newRowsPerPage,
      sortBy: orderBy,
      sortOrder: order,
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(appliedFilters).filter((value) => value !== "").length;
  };

  const getFilterChips = () => {
    const chips = [];
    if (appliedFilters.search)
      chips.push({ label: `Busca: ${appliedFilters.search}`, key: "search" });
    if (appliedFilters.firstName)
      chips.push({
        label: `Nome: ${appliedFilters.firstName}`,
        key: "firstName",
      });
    if (appliedFilters.lastName)
      chips.push({
        label: `Sobrenome: ${appliedFilters.lastName}`,
        key: "lastName",
      });
    if (appliedFilters.email)
      chips.push({ label: `Email: ${appliedFilters.email}`, key: "email" });
    if (appliedFilters.roleId)
      chips.push({ label: `Role: ${appliedFilters.roleId}`, key: "roleId" });
    if (appliedFilters.statusId)
      chips.push({
        label: `Status: ${appliedFilters.statusId}`,
        key: "statusId",
      });
    if (appliedFilters.clientId) {
      const client = allClients.find(
        (c) => c.id.toString() === appliedFilters.clientId
      );
      chips.push({
        label: `Cliente: ${client?.razaoSocial || appliedFilters.clientId}`,
        key: "clientId",
      });
    }
    if (appliedFilters.systemRoleId)
      chips.push({
        label: `Role Sistema: ${appliedFilters.systemRoleId}`,
        key: "systemRoleId",
      });
    if (appliedFilters.clientRoleId)
      chips.push({
        label: `Role Cliente: ${appliedFilters.clientRoleId}`,
        key: "clientRoleId",
      });
    return chips;
  };

  const removeFilterChip = (key: string) => {
    const newFilters = { ...appliedFilters, [key]: "" };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setPage(0);
    updateURL({
      ...newFilters,
      page: 0,
      limit: rowsPerPage,
      sortBy: orderBy,
      sortOrder: order,
    });
  };

  return (
    <AdminPageLayout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
        >
          Usuários do Sistema
        </Typography>
        {/* Header com botões */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Search />}
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              sx={{
                borderColor: "#4caf50",
                color: "#4caf50",
                "&:hover": {
                  borderColor: "#45a049",
                  backgroundColor: "rgba(76, 175, 80, 0.04)",
                },
              }}
            >
              Filtros
              {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={`${getActiveFiltersCount()} filtro(s) ativo(s)`}
                color="primary"
                size="small"
              />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{
                borderColor: "#f44336",
                color: "#f44336",
                "&:hover": {
                  borderColor: "#d32f2f",
                  backgroundColor: "rgba(244, 67, 54, 0.04)",
                },
              }}
            >
              Limpar
            </Button>
            <Button variant="contained" onClick={handleApplyFilters}>
              Filtrar
            </Button>
          </Box>
        </Box>

        {/* Filtros ativos */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {getFilterChips().map((chip) => (
              <Chip
                key={chip.key}
                label={chip.label}
                onDelete={() => removeFilterChip(chip.key)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        )}

        {/* Filtros */}
        <Collapse in={filtersExpanded}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label="Busca Geral" />
              <Tab label="Filtros Avançados" />
            </Tabs>

            {activeTab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Buscar por nome, sobrenome ou email"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  fullWidth
                  placeholder="Digite para buscar..."
                />
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "1fr 1fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={filters.roleId}
                      onChange={(e) =>
                        handleFilterChange("roleId", e.target.value)
                      }
                      label="Role"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="1">Admin</MenuItem>
                      <MenuItem value="2">User</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.statusId}
                      onChange={(e) =>
                        handleFilterChange("statusId", e.target.value)
                      }
                      label="Status"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="1">Ativo</MenuItem>
                      <MenuItem value="2">Inativo</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                      value={filters.clientId}
                      onChange={(e) =>
                        handleFilterChange("clientId", e.target.value)
                      }
                      label="Cliente"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {allClients.map((client) => (
                        <MenuItem key={client.id} value={client.id.toString()}>
                          {client.razaoSocial}
                        </MenuItem>
                      ))}
                      {hasNextPage && (
                        <MenuItem
                          disabled={isFetchingNextPage}
                          onClick={() => fetchNextPage()}
                          sx={{
                            justifyContent: "center",
                            fontWeight: "bold",
                            color: "primary.main",
                          }}
                        >
                          {isFetchingNextPage
                            ? "Carregando..."
                            : "Carregar mais..."}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
          </Paper>
        </Collapse>

        {/* Tabela */}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    key="id"
                    align="left"
                    style={{ minWidth: 70 }}
                    sortDirection={orderBy === "id" ? order : false}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f8f0",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      padding: { xs: "8px 4px", sm: "16px" },
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "id"}
                      direction={orderBy === "id" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "id")}
                      sx={{
                        "&.MuiTableSortLabel-root": {
                          color: "inherit",
                          "&:hover": {
                            color: "inherit",
                          },
                          "&.Mui-active": {
                            color: "inherit",
                          },
                        },
                        "&.MuiTableSortLabel-icon": {
                          color: "inherit !important",
                        },
                      }}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="firstName"
                    align="left"
                    style={{ minWidth: 120 }}
                    sortDirection={orderBy === "firstName" ? order : false}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f8f0",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      padding: { xs: "8px 4px", sm: "16px" },
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "firstName"}
                      direction={orderBy === "firstName" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "firstName")}
                      sx={{
                        "&.MuiTableSortLabel-root": {
                          color: "inherit",
                          "&:hover": {
                            color: "inherit",
                          },
                          "&.Mui-active": {
                            color: "inherit",
                          },
                        },
                        "&.MuiTableSortLabel-icon": {
                          color: "inherit !important",
                        },
                      }}
                    >
                      Nome
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="lastName"
                    align="left"
                    style={{ minWidth: 120 }}
                    sortDirection={orderBy === "lastName" ? order : false}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f8f0",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      padding: { xs: "8px 4px", sm: "16px" },
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "lastName"}
                      direction={orderBy === "lastName" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "lastName")}
                      sx={{
                        "&.MuiTableSortLabel-root": {
                          color: "inherit",
                          "&:hover": {
                            color: "inherit",
                          },
                          "&.Mui-active": {
                            color: "inherit",
                          },
                        },
                        "&.MuiTableSortLabel-icon": {
                          color: "inherit !important",
                        },
                      }}
                    >
                      Sobrenome
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="email"
                    align="left"
                    style={{ minWidth: 200 }}
                    sortDirection={orderBy === "email" ? order : false}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f8f0",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      padding: { xs: "8px 4px", sm: "16px" },
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "email"}
                      direction={orderBy === "email" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "email")}
                      sx={{
                        "&.MuiTableSortLabel-root": {
                          color: "inherit",
                          "&:hover": {
                            color: "inherit",
                          },
                          "&.Mui-active": {
                            color: "inherit",
                          },
                        },
                        "&.MuiTableSortLabel-icon": {
                          color: "inherit !important",
                        },
                      }}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="role"
                    align="left"
                    style={{ minWidth: 120 }}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f8f0",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      padding: { xs: "8px 4px", sm: "16px" },
                    }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    key="status"
                    align="left"
                    style={{ minWidth: 100 }}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f8f0",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      padding: { xs: "8px 4px", sm: "16px" },
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    key="clients"
                    align="left"
                    style={{ minWidth: 200 }}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f8f0",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      padding: { xs: "8px 4px", sm: "16px" },
                    }}
                  >
                    Clientes
                  </TableCell>
                  <TableCell
                    key="createdAt"
                    align="left"
                    style={{ minWidth: 120 }}
                    sortDirection={orderBy === "createdAt" ? order : false}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f8f0",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      padding: { xs: "8px 4px", sm: "16px" },
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "createdAt")}
                      sx={{
                        "&.MuiTableSortLabel-root": {
                          color: "inherit",
                          "&:hover": {
                            color: "inherit",
                          },
                          "&.Mui-active": {
                            color: "inherit",
                          },
                        },
                        "&.MuiTableSortLabel-icon": {
                          color: "inherit !important",
                        },
                      }}
                    >
                      Criado em
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="updatedAt"
                    align="left"
                    style={{ minWidth: 120 }}
                    sortDirection={orderBy === "updatedAt" ? order : false}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f8f0",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      padding: { xs: "8px 4px", sm: "16px" },
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "updatedAt"}
                      direction={orderBy === "updatedAt" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "updatedAt")}
                      sx={{
                        "&.MuiTableSortLabel-root": {
                          color: "inherit",
                          "&:hover": {
                            color: "inherit",
                          },
                          "&.Mui-active": {
                            color: "inherit",
                          },
                        },
                        "&.MuiTableSortLabel-icon": {
                          color: "inherit !important",
                        },
                      }}
                    >
                      Atualizado em
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography>Carregando...</Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Alert severity="error">
                        Erro ao carregar usuários. Tente novamente.
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : usersData?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography>Nenhum usuário encontrado</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  usersData?.data?.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {user.id}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {user.firstName}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {user.lastName}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {user.email}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {user.role?.name || "-"}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {user.status?.name || "-"}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {user.clients && user.clients.length > 0 ? (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {user.clients.map((client: any) => (
                              <Chip
                                key={client.id}
                                label={client.razaoSocial}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            ))}
                          </Box>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {new Date(user.updatedAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={usersData?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
            sx={{
              "& .MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                gap: 1,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
            }}
          />
        </Paper>
      </Box>
    </AdminPageLayout>
  );
}
