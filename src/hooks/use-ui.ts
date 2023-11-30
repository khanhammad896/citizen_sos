import { UiContext, UiContextType } from "@contexts/ui";
import { useContext } from "react";

export const useUi = <T = UiContextType>() => useContext(UiContext) as T;
