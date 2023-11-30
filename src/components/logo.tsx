import { ViewProps } from "react-native";
import React, { FC, useCallback } from "react";
import Badge from "@assets/media/badge.svg";
import Title from "@assets/media/title.svg";
import { wp } from "@utils/helper";
import Box from "./layout/box";

const WIDTH = 208;
const HEIGHT = 163;

interface LogoProps extends ViewProps {
  width?: number;
  height?: number;
}

const Logo: FC<LogoProps> = ({ width = wp(WIDTH), height = wp(HEIGHT) }) => {
  const getRelWidth = useCallback(
    (value: number) => {
      return (value / WIDTH) * width;
    },
    [width],
  );

  const getRelHeight = useCallback(
    (value: number) => {
      return (value / HEIGHT) * height;
    },
    [height],
  );

  return (
    <Box centered style={{ width, height }}>
      <Badge width={getRelWidth(86)} />
      <Title
        width={getRelWidth(208)}
        height={getRelHeight(49)}
        style={{ marginTop: getRelWidth(16) }}
      />
    </Box>
  );
};

export default Logo;
