import { useContext } from "react";
import { AuthTokensContext } from "./auth-context";

export default function useAuthTokens() {
  const context = useContext(AuthTokensContext);

  if (!context) {
    throw new Error("useAuthTokens must be used within an AuthProvider");
  }

  return context;
}
