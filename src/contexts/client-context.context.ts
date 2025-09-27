import { createContext } from "react";
import { type ClientContextType } from "./client-context.types";

export const ClientContext = createContext<ClientContextType | undefined>(undefined);
