import { useContext } from "react";
import { ThemeContext } from "@/components/theme/theme-context";

export function useTheme() {
  return useContext(ThemeContext);
}
