import { useContext } from "react";
import { AuthActionsContext } from "./auth-context";

export default function useAuthActions() {
  const context = useContext(AuthActionsContext);

  if (!context) {
    throw new Error("useAuthActions must be used within an AuthProvider");
  }

  return context;
}
