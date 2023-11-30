import { colors } from "@theme/index";
import React from "react";
import { SvgProps } from "react-native-svg";
import { z } from "zod";

export * from "./navigation";
export * from "./form";
export * from "./schema";

export enum Languages {
  ENGLISH = "en",
  URDU = "ur",
}

export type WelcomeItemType = {
  id: string;
  title: string;
  description?: string;
  illustration: React.FC<SvgProps>;
  height: number;
};

export const ImageType = z.object({
  base64: z.string().optional(),
  uri: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  originalPath: z.string().optional(),
  fileSize: z.number().optional(),
  type: z.literal("image/jpeg"),
  fileName: z.string().optional(),
  duration: z.number().optional(),
  bitrate: z.number().optional(),
  timestamp: z.string().optional(),
  id: z.string().optional(),
});

export const VideoType = z.object({
  base64: z.string().optional(),
  uri: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  originalPath: z.string().optional(),
  fileSize: z.number().optional(),
  type: z.literal("video/mp4"),
  fileName: z.string().optional(),
  duration: z.number().optional(),
  bitrate: z.number().optional(),
  timestamp: z.string().optional(),
  id: z.string().optional(),
});

export type PlayerState = {
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
  isPlaying: boolean;
  path: string;
};

export type ColorType = keyof typeof colors;
