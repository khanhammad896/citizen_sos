import { Direction } from "@theme/index";
import { storage } from "App";
import { FieldErrors, FieldValues } from "react-hook-form";
import Toast from "react-native-toast-message";
import { tokens } from "@locales/tokens";
import {
  AUTH_KEY,
  REFERENCE_HEIGHT,
  REFERENCE_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "./constants";
import { CaseStatus, ColorType } from "./types";

export const wp = (pixels: number) => {
  const v = Math.floor((pixels * SCREEN_WIDTH) / REFERENCE_WIDTH);
  return v;
};

export const hp = (pixels: number) => {
  const v = Math.floor((pixels * SCREEN_HEIGHT) / REFERENCE_HEIGHT);
  return v;
};

export const isRight = (direction: Direction): boolean => {
  return direction === "rtl";
};

export const transColor = (color: string, opacity: number) => {
  const hexToR = (h: string) => parseInt(h.substring(0, 2), 16);
  const hexToG = (h: string) => parseInt(h.substring(2, 4), 16);
  const hexToB = (h: string) => parseInt(h.substring(4, 6), 16);

  const r = hexToR(color.slice(1));
  const g = hexToG(color.slice(1));
  const b = hexToB(color.slice(1));

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getInitials = (name: string) => {
  const nameList = name.split(" ");
  if (nameList.length > 1) {
    return `${nameList[0][0]}${nameList[1][0]}`.toUpperCase();
  }
  if (nameList[0].length > 1) {
    return `${nameList[0][0]}${nameList[0][1]}`.toUpperCase();
  }
  return null;
};

type StatusDetail = {
  label: string;
  color: ColorType;
};

export const getToken = (): string | null => {
  const user = storage.getString(AUTH_KEY);
  if (user !== undefined && user !== null) {
    return JSON.parse(user).token;
  }
  return null;
};

export function getError<T extends FieldValues>(
  errors: FieldErrors<T>,
  field: keyof T,
): string | undefined {
  if (errors[field] != null) {
    return errors[field]?.message as string | undefined;
  }
  return undefined;
}

// ================ Case status based on arrival feedbacks ===============

// export function getCaseStatus(history: CaseSchema): StatusDetail {
//   if (history.final_feedback === 1)
//     return { label: "Completed", color: "success" };
//   else {
//     if (history.arrival_feedback === 1)
//       return { label: "In Progress", color: "complemantary" };
//     else {
//       if (history.accepted === 1)
//         return { label: "Accepted", color: "secondary" };
//       else {
//         if (history.read === 1) return { label: "Recieved", color: "tertiary" };
//       }
//     }
//   }
//   return {
//     label: "Pending",
//     color: "shock",
//   };
// }

export function getCaseStatus(status: CaseStatus): StatusDetail {
  if (status) {
    if (status === "accepted")
      return { label: tokens.history.accepted, color: "secondary" };
    if (status === "dispatching")
      return { label: tokens.history.dispatching, color: "warn" };
    if (status === "dispatched")
      return { label: tokens.history.dispatched, color: "tertiary" };
    if (status === "feedback")
      return { label: tokens.history.feedback, color: "primary" };
    if (status === "closed")
      return { label: tokens.history.closed, color: "success" };
    if (status === "invalid")
      return { label: tokens.history.invalid, color: "danger" };
  }
  return {
    label: "Pending",
    color: "shock",
  };
}

export const generateRandomColor = () => {
  const colors = [
    "#886B03",
    "#542323",
    "#748C2E",
    "#748C2E",
    "#9B254F",
    "#A8834B",
    "#3D8A81",
    "#A73434",
    "#446493",
    "#955C3D",
    "#5E2A70",
    "#645757",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const showToast = (
  type: "error" | "success" | "info",
  text1?: string,
) => {
  Toast.show({
    type,
    text1,
    position: "bottom",
    bottomOffset: SCREEN_HEIGHT / 8,
  });
};
