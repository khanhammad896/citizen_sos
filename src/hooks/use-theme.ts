import { ThemeContext, ThemeContextType } from "@contexts/theme";
import { useContext } from "react";

export const useTheme = <T = ThemeContextType>() =>
  useContext(ThemeContext) as T;
