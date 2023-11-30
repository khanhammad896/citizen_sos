import { ThemeConfig, colors, fonts } from "@theme/index";
import { Languages } from "@utils/types";
import { createContext } from "react";

export const initialState: ThemeConfig = {
  colors,
  direction: "ltr",
  fonts,
};

export interface ThemeContextType extends ThemeConfig {
  changeDirection: (language: Languages) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  ...initialState,
  changeDirection: () => {},
});
