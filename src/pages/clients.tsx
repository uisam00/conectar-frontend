import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Collapse,
  Tabs,
  Tab,
} from "@mui/material";
import { Search, ExpandLess, ExpandMore } from "@mui/icons-material";
import AdminPageLayout from "@/components/layout/admin-page-layout";

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    cnpj: "",
    status: "",
    conectarPlus: "",
  });

  const clients = [
    {
      id: 1,
      razaoSocial: "TOKEN TEST LTDA",
      cnpj: "71.547.504/0001-74",
      nomeFachada: "JOANINHA BISTRÔ",
      tags: "",
      status: "Inativo",
      conectarPlus: "Não",
    },
    {
      id: 2,
      razaoSocial: "RESTAURANTE BOA VISTA",
      cnpj: "71.673.990/0001-77",
      nomeFachada: "RESTAURANTE BOA VISTA",
      tags: "",
      status: "Inativo",
      conectarPlus: "Não",
    },
    {
      id: 3,
      razaoSocial: "TOKEN TEST LTDA",
      cnpj: "64.132.434/0005-51",
      nomeFachada: "Geo Food",
      tags: "",
      status: "Inativo",
      conectarPlus: "Não",
    },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      cnpj: "",
      status: "",
      conectarPlus: "",
    });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <AdminPageLayout>
      <Box sx={{ backgroundColor: "white", borderRadius: 1, mb: 3 }}>
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
          <Tab label="Dados Básicos" />
        </Tabs>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 1, border: "1px solid #e0e0e0" }}>
        <Box
          sx={{
            padding: 2,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Search sx={{ color: "#666" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Filtros
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Filtre e busque itens na página
            </Typography>
          </Box>
          {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
        </Box>

        <Collapse in={filtersExpanded}>
          <Box sx={{ padding: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Buscar por nome"
                value={filters.name}
                onChange={e => handleFilterChange("name", e.target.value)}
                size="small"
              />
              <TextField
                label="Buscar por CNPJ"
                value={filters.cnpj}
                onChange={e => handleFilterChange("cnpj", e.target.value)}
                size="small"
              />
              <FormControl size="small">
                <InputLabel>Buscar por status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={e => handleFilterChange("status", e.target.value)}
                  label="Buscar por status"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Buscar por conectar+</InputLabel>
                <Select
                  value={filters.conectarPlus}
                  onChange={e =>
                    handleFilterChange("conectarPlus", e.target.value)
                  }
                  label="Buscar por conectar+"
                >
                  <MenuItem value="">Selecione</MenuItem>
                  <MenuItem value="sim">Sim</MenuItem>
                  <MenuItem value="nao">Não</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{ color: "primary.main", borderColor: "primary.main" }}
              >
                Limpar campos
              </Button>
              <Button variant="contained">Filtrar</Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
            Clientes
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Selecione um usuário para editar suas informações
          </Typography>
        </Box>
        <Button variant="outlined" sx={{ color: "#666", borderColor: "#666" }}>
          Novo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f8f0" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Razão social</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>CNPJ</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nome na fachada</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tags</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Conecta Plus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map(client => (
              <TableRow key={client.id} hover>
                <TableCell>{client.razaoSocial}</TableCell>
                <TableCell>{client.cnpj}</TableCell>
                <TableCell>{client.nomeFachada}</TableCell>
                <TableCell>{client.tags || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={client.status}
                    size="small"
                    color={client.status === "Ativo" ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{client.conectarPlus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminPageLayout>
  );
}
