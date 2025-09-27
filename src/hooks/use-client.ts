import { useContext } from "react";
import { ClientContext } from "@/contexts/client-context.context";

export function useClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}
