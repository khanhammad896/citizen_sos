import { useTheme } from "@hooks/use-theme";
import { wp } from "@utils/helper";
import React, { type FC } from "react";
import { Text, type TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  size?: number;
  color?: string;
  aligned?: "center" | "left" | "right";
  spacing?: number;
}

const withTextHOC = (Component: React.ComponentType<CustomTextProps>) => {
  const TextHOC: FC<CustomTextProps> = ({
    children,
    size = 14,
    color,
    style,
    aligned,
    spacing,
    ...props
  }) => {
    const { colors } = useTheme();
    return (
      <Component
        style={[
          {
            fontSize: wp(size),
            color: color ?? colors.night,
            ...(aligned !== undefined && { textAlign: aligned }),
            ...(spacing !== undefined && { letterSpacing: spacing }),
          },
          style,
        ]}
        {...props}
      >
        {children}
      </Component>
    );
  };
  return TextHOC;
};

export const Bold: FC<CustomTextProps> = withTextHOC(
  ({ children, style, ...props }) => {
    const { fonts } = useTheme();
    return (
      <Text style={[{ fontFamily: fonts.bold }, style]} {...props}>
        {children}
      </Text>
    );
  },
);

export const Medium: FC<CustomTextProps> = withTextHOC(
  ({ children, style, ...props }) => {
    const { fonts } = useTheme();
    return (
      <Text style={[{ fontFamily: fonts.medium }, style]} {...props}>
        {children}
      </Text>
    );
  },
);

export const Regular: FC<CustomTextProps> = withTextHOC(
  ({ children, style, ...props }) => {
    const { fonts } = useTheme();

    return (
      <Text style={[{ fontFamily: fonts.regular }, style]} {...props}>
        {children}
      </Text>
    );
  },
);

export const Light: FC<CustomTextProps> = withTextHOC(
  ({ children, style, ...props }) => {
    const { fonts } = useTheme();

    return (
      <Text style={[{ fontFamily: fonts.light }, style]} {...props}>
        {children}
      </Text>
    );
  },
);
