import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/services/i18n";
import { Helmet } from "react-helmet";
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
import {
  Search,
  ExpandLess,
  ExpandMore,
  Visibility,
  Edit,
  Add,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import AdminPageLayout from "@/components/layout/admin-page-layout";
import { useClients } from "@/hooks/use-clients-query";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";

type Order = "asc" | "desc";

export default function ListClientsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage("list-clients");

  const [activeTab, setActiveTab] = useState(0);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    cnpj: searchParams.get("cnpj") || "",
    status: searchParams.get("status") || "",
    conectarPlus: searchParams.get("conectarPlus") || "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    name: searchParams.get("name") || "",
    cnpj: searchParams.get("cnpj") || "",
    status: searchParams.get("status") || "",
    conectarPlus: searchParams.get("conectarPlus") || "",
  });
  const [hasSearched, setHasSearched] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "0"));
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(searchParams.get("limit") || "10")
  );
  const [order, setOrder] = useState<Order>(
    (searchParams.get("order") as Order) || "asc"
  );
  const [orderBy, setOrderBy] = useState<string>(
    searchParams.get("sortBy") || ""
  );

  // Função para atualizar a URL com os parâmetros atuais
  const updateURL = (
    newFilters: typeof appliedFilters,
    newPage: number,
    newRowsPerPage: number,
    newOrder: Order,
    newOrderBy: string
  ) => {
    const params = new URLSearchParams();

    if (newFilters.name) params.set("name", newFilters.name);
    if (newFilters.cnpj) params.set("cnpj", newFilters.cnpj);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.conectarPlus)
      params.set("conectarPlus", newFilters.conectarPlus);
    if (newPage >= 0) params.set("page", newPage.toString());
    if (newRowsPerPage !== 10) params.set("limit", newRowsPerPage.toString());
    if (newOrderBy) params.set("sortBy", newOrderBy);
    if (newOrder !== "asc") params.set("order", newOrder);

    setSearchParams(params);
  };

  // Mapear filtros da UI para filtros da API
  const apiFilters = useMemo(
    () => ({
      search: appliedFilters.name,
      cnpj: appliedFilters.cnpj,
      statusId: appliedFilters.status
        ? parseInt(appliedFilters.status)
        : undefined,
      isSpecial:
        appliedFilters.conectarPlus === "sim"
          ? true
          : appliedFilters.conectarPlus === "nao"
            ? false
            : undefined,
      page: page + 1, // API usa página baseada em 1
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

  const { clients, total, loading, error } = useClients(
    apiFilters,
    hasSearched
  );

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setHasSearched(true);
    setPage(0);
    updateURL(filters, 0, rowsPerPage, order, orderBy);
  };

  const clearFilters = () => {
    const emptyFilters = {
      name: "",
      cnpj: "",
      status: "",
      conectarPlus: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(0);
    setHasSearched(true); // Aplicar busca vazia para limpar resultados
    updateURL(emptyFilters, 0, rowsPerPage, order, orderBy);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    updateURL(appliedFilters, newPage, rowsPerPage, order, orderBy);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    updateURL(appliedFilters, 0, newRowsPerPage, order, orderBy);
  };

  const getStatusLabel = (statusId: number) => {
    switch (statusId) {
      case 1:
        return t("table.status.active");
      case 2:
        return t("table.status.inactive");
      default:
        return t("table.status.unknown");
    }
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "success";
      case 2:
        return "default";
      default:
        return "default";
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);
    setPage(0);
    updateURL(appliedFilters, 0, rowsPerPage, newOrder, property);
  };

  // Definir colunas da tabela
  interface Column {
    id:
      | "avatar"
      | "id"
      | "razaoSocial"
      | "cnpj"
      | "nomeComercial"
      | "planId"
      | "conectaPlus"
      | "statusId"
      | "actions";
    label: string;
    minWidth?: number;
    align?: "right" | "center";
  }

  const columns: readonly Column[] = [
    { id: "avatar", label: t("table.headers.avatar"), minWidth: 60 },
    { id: "id", label: t("table.headers.id"), minWidth: 80 },
    { id: "razaoSocial", label: t("table.headers.razaoSocial"), minWidth: 200 },
    { id: "cnpj", label: t("table.headers.cnpj"), minWidth: 150 },
    {
      id: "nomeComercial",
      label: t("table.headers.nomeComercial"),
      minWidth: 200,
    },
    { id: "planId", label: t("table.headers.plan"), minWidth: 150 },
    {
      id: "conectaPlus",
      label: t("table.headers.conectarPlus"),
      minWidth: 120,
    },
    { id: "statusId", label: t("table.headers.status"), minWidth: 120 },
    {
      id: "actions",
      label: t("table.headers.actions"),
      minWidth: 120,
      align: "center",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Instituições | Conéctar</title>
      </Helmet>
      <Box
        sx={{
          height: { xs: "calc(100vh - 64px)", sm: "auto" },
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AdminPageLayout>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              mb: { xs: 2, sm: 3 },
              overflow: "hidden",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                borderBottom: "1px solid #e0e0e0",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "bold",
                  minHeight: 48,
                },
              }}
            >
              <Tab label={t("tabs.basicData")} />
            </Tabs>
          </Box>

          <Paper
            sx={{
              mb: { xs: 2, sm: 3 },
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                padding: { xs: 1.5, sm: 2 },
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setFiltersExpanded(!filtersExpanded)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Search sx={{ color: "#666" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    {t("filters.title")}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {t("filters.subtitle")}
                </Typography>
              </Box>
              {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
            </Box>

            <Collapse in={filtersExpanded}>
              <Box sx={{ padding: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    label={t("filters.searchByName")}
                    value={filters.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                    size="small"
                    placeholder={t("filters.searchByNamePlaceholder")}
                  />
                  <TextField
                    label={t("filters.searchByCnpj")}
                    value={filters.cnpj}
                    onChange={(e) => handleFilterChange("cnpj", e.target.value)}
                    size="small"
                    placeholder={t("filters.searchByCnpjPlaceholder")}
                  />
                  <FormControl size="small">
                    <InputLabel>{t("filters.searchByStatus")}</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      label={t("filters.searchByStatus")}
                    >
                      <MenuItem value="">{t("filters.selectOption")}</MenuItem>
                      <MenuItem value="ativo">
                        {t("filters.status.active")}
                      </MenuItem>
                      <MenuItem value="inativo">
                        {t("filters.status.inactive")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <InputLabel>{t("filters.searchByConectarPlus")}</InputLabel>
                    <Select
                      value={filters.conectarPlus}
                      onChange={(e) =>
                        handleFilterChange("conectarPlus", e.target.value)
                      }
                      label={t("filters.searchByConectarPlus")}
                    >
                      <MenuItem value="">{t("filters.selectOption")}</MenuItem>
                      <MenuItem value="sim">
                        {t("filters.conectarPlus.yes")}
                      </MenuItem>
                      <MenuItem value="nao">
                        {t("filters.conectarPlus.no")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    sx={{
                      color: "primary.main",
                      borderColor: "primary.main",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    {t("filters.buttons.clear")}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={applyFilters}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    {t("filters.buttons.filter")}
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Paper>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: { xs: 1.5, sm: 2 },
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1.5, sm: 0 },
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {t("header.title")}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {total > 0
                  ? t("header.subtitle", { count: total })
                  : t("header.noResults")}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => navigate("/admin/clients/create")}
              sx={{
                color: "#666",
                borderColor: "#666",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {t("header.newButton")}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t("messages.loadError")}
            </Alert>
          )}

          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              mb: { xs: 1, sm: 0 },
            }}
          >
            <TableContainer
              sx={{
                maxHeight: { xs: "calc(100vh - 400px)", sm: 440 },
                overflowX: "auto",
                overflowY: "auto",
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{ minWidth: 600 }}
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        sortDirection={orderBy === column.id ? order : false}
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#f0f8f0",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          padding: { xs: "8px 4px", sm: "16px" },
                        }}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
                          onClick={(event) =>
                            handleRequestSort(event, column.id)
                          }
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
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        {t("messages.loading")}
                      </TableCell>
                    </TableRow>
                  ) : clients.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        {t("messages.noData")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients.map((client) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={client.id}
                      >
                        {columns.map((column) => {
                          const value =
                            column.id === "avatar" || column.id === "actions"
                              ? null
                              : client[column.id as keyof typeof client];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                padding: { xs: "8px 4px", sm: "16px" },
                              }}
                            >
                              {column.id === "actions" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    justifyContent: "center",
                                  }}
                                >
                                  <Tooltip title={t("table.actions.view")}>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        navigate(`/admin/clients/${client.id}`)
                                      }
                                      sx={{ color: "primary.main" }}
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={t("table.actions.edit")}>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        navigate(
                                          `/admin/clients/${client.id}/edit`
                                        )
                                      }
                                      sx={{ color: "secondary.main" }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              ) : column.id === "avatar" ? (
                                <Avatar
                                  src={client.photo?.path}
                                  alt={client.razaoSocial}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {client.razaoSocial?.charAt(0)?.toUpperCase()}
                                </Avatar>
                              ) : column.id === "id" ? (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: "medium",
                                    color: "text.secondary",
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {client.id}
                                </Typography>
                              ) : column.id === "statusId" ? (
                                <Chip
                                  label={getStatusLabel(value as number)}
                                  size="small"
                                  color={getStatusColor(value as number) as any}
                                  variant="outlined"
                                  sx={{
                                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                  }}
                                />
                              ) : column.id === "planId" ? (
                                t("table.plan.default", { id: value })
                              ) : column.id === "conectaPlus" ? (
                                <Chip
                                  label={t("table.conectarPlus.no")}
                                  size="small"
                                  color="default"
                                  variant="outlined"
                                  sx={{
                                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                  }}
                                />
                              ) : typeof value === "object" ? (
                                JSON.stringify(value)
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                "& .MuiTablePagination-toolbar": {
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 0 },
                  alignItems: { xs: "stretch", sm: "center" },
                },
                "& .MuiTablePagination-selectLabel": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiTablePagination-displayedRows": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
                "& .MuiTablePagination-select": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
              }}
            />
          </Paper>
        </AdminPageLayout>
      </Box>
    </>
  );
}
