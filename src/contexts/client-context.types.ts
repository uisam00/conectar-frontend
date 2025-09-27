import { type Client } from "@/hooks/use-user-clients";

export interface ClientContextType {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  userClients: Client[];
  isLoading: boolean;
  error: string | null;
  refreshClients: () => Promise<void>;
}
