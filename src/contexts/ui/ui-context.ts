import { Languages } from "@utils/types";
import { createContext } from "react";

export interface State {
  language: "en" | "ur";
}

export const initialState: State = {
  language: "en",
};

export interface UiContextType extends State {
  changeLanguage: (langugae: Languages) => void;
}

export const UiContext = createContext<UiContextType>({
  ...initialState,
  changeLanguage: () => {},
});
