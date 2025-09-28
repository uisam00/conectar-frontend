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
import { useLanguage } from "@/services/i18n";

type Order = "asc" | "desc";

export default function UsersPage() {
  const { t } = useLanguage("usersAdminPanel");
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
    staleTime: 5 * 60 * 1000,
  });

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
      chips.push({
        label: t("filterChips.search", { value: appliedFilters.search }),
        key: "search",
      });
    if (appliedFilters.firstName)
      chips.push({
        label: t("filterChips.firstName", { value: appliedFilters.firstName }),
        key: "firstName",
      });
    if (appliedFilters.lastName)
      chips.push({
        label: t("filterChips.lastName", { value: appliedFilters.lastName }),
        key: "lastName",
      });
    if (appliedFilters.email)
      chips.push({
        label: t("filterChips.email", { value: appliedFilters.email }),
        key: "email",
      });
    if (appliedFilters.roleId)
      chips.push({
        label: t("filterChips.role", { value: appliedFilters.roleId }),
        key: "roleId",
      });
    if (appliedFilters.statusId)
      chips.push({
        label: t("filterChips.status", { value: appliedFilters.statusId }),
        key: "statusId",
      });
    if (appliedFilters.clientId) {
      const client = allClients.find(
        (c) => c.id.toString() === appliedFilters.clientId
      );
      chips.push({
        label: t("filterChips.client", {
          value: client?.razaoSocial || appliedFilters.clientId,
        }),
        key: "clientId",
      });
    }
    if (appliedFilters.systemRoleId)
      chips.push({
        label: t("filterChips.systemRole", {
          value: appliedFilters.systemRoleId,
        }),
        key: "systemRoleId",
      });
    if (appliedFilters.clientRoleId)
      chips.push({
        label: t("filterChips.clientRole", {
          value: appliedFilters.clientRoleId,
        }),
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
          component="h1"
          gutterBottom
          sx={{ mb: 2, color: "primary.main" }}
        >
          {t("title")}
        </Typography>
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
              {t("filters.button")}
              {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={`${getActiveFiltersCount()} ${t("filters.activeCount")}`}
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
              {t("filters.clear")}
            </Button>
            <Button variant="contained" onClick={handleApplyFilters}>
              {t("filters.apply")}
            </Button>
          </Box>
        </Box>

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

        <Collapse in={filtersExpanded}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label={t("filters.tabs.general")} />
              <Tab label={t("filters.tabs.advanced")} />
            </Tabs>

            {activeTab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label={t("filters.search.label")}
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  fullWidth
                  placeholder={t("filters.search.placeholder")}
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
                    <InputLabel>{t("filters.role.label")}</InputLabel>
                    <Select
                      value={filters.roleId}
                      onChange={(e) =>
                        handleFilterChange("roleId", e.target.value)
                      }
                      label={t("filters.role.label")}
                    >
                      <MenuItem value="">{t("filters.role.all")}</MenuItem>
                      <MenuItem value="1">{t("filters.role.admin")}</MenuItem>
                      <MenuItem value="2">{t("filters.role.user")}</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>{t("filters.status.label")}</InputLabel>
                    <Select
                      value={filters.statusId}
                      onChange={(e) =>
                        handleFilterChange("statusId", e.target.value)
                      }
                      label={t("filters.status.label")}
                    >
                      <MenuItem value="">{t("filters.status.all")}</MenuItem>
                      <MenuItem value="1">
                        {t("filters.status.active")}
                      </MenuItem>
                      <MenuItem value="2">
                        {t("filters.status.inactive")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>{t("filters.client.label")}</InputLabel>
                    <Select
                      value={filters.clientId}
                      onChange={(e) =>
                        handleFilterChange("clientId", e.target.value)
                      }
                      label={t("filters.client.label")}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">{t("filters.client.all")}</MenuItem>
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
                            ? t("filters.client.loading")
                            : t("filters.client.loadMore")}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
          </Paper>
        </Collapse>

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
                      {t("table.headers.id")}
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
                      {t("table.headers.firstName")}
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
                      {t("table.headers.lastName")}
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
                      {t("table.headers.email")}
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
                    {t("table.headers.role")}
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
                    {t("table.headers.status")}
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
                    {t("table.headers.clients")}
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
                      {t("table.headers.createdAt")}
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
                      {t("table.headers.updatedAt")}
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography>{t("table.loading")}</Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Alert severity="error">{t("table.error")}</Alert>
                    </TableCell>
                  </TableRow>
                ) : usersData?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography>{t("table.noData")}</Typography>
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
            labelRowsPerPage={t("table.pagination.rowsPerPage")}
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
