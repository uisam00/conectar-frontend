import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useUserClients, type Client } from "@/hooks/use-user-clients";
import { useAuth } from "@/services/auth";
import { type ClientContextType } from "./client-context.types";
import { ClientContext } from "./client-context.context";

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [userClients, setUserClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchUserClients } = useUserClients();
  const { user } = useAuth();

  const refreshClients = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchUserClients();
      setUserClients(response.clients);

      if (!selectedClient && response.clients.length > 0) {
        setSelectedClient(response.clients[0]);
      }
    } catch (err) {
      setError("Erro ao carregar instituições");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchUserClients]);

  useEffect(() => {
    if (user) {
      refreshClients();
    }
  }, [user?.id]);

  const value: ClientContextType = {
    selectedClient,
    setSelectedClient,
    userClients,
    isLoading,
    error,
    refreshClients,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}
