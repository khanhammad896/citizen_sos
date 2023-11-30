export type Direction = "ltr" | "rtl";

export const colors = {
  light: "#fff",
  night: "#000",
  zinc: "#D9D9D9",
  primary: "#22295D",
  fade: "#505F79",
  off: "#A2A2A2",
  secondary: "#2B80FF",
  success: "#29B18D",
  tertiary: "#C67979",
  complemantary: "#B3D7C8",
  background: "#F4F5FF",
  danger: "#FF4D4D",
  shock: "#FF5C00",
  sky: "#0D8FCF",
  warn: "#EA9312",
};

export const fonts = {
  bold: "Roboto-Bold",
  medium: "Roboto-Medium",
  regular: "Roboto-Regular",
  light: "Roboto-Light",
};

export interface ThemeConfig {
  colors: Record<keyof typeof colors, string>;
  direction: Direction;
  fonts: Record<keyof typeof fonts, string>;
}
