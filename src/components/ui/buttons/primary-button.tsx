import {
  TouchableOpacity,
  StyleSheet,
  type TouchableOpacityProps,
  ColorValue,
} from "react-native";
import React, { type FC } from "react";
import { useTheme } from "@hooks/use-theme";
import { wp } from "@utils/helper";
import { Box } from "@components/layout";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Text } from "../typography";

interface PrimaryButtonProps extends TouchableOpacityProps {
  bgcolor?: ColorValue;
  color?: string;
  startAdornment?: (() => React.ReactNode) | IconProp;
  endAdornment?: (() => React.ReactNode) | IconProp;
  variant?: "contained" | "outlined";
  radius?: number;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  style,
  bgcolor,
  startAdornment,
  endAdornment,
  variant = "contained",
  radius = 16,
  color,
  ...props
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles();
  return (
    <TouchableOpacity style={[styles.root, style]} {...props}>
      <Box
        full
        row
        between
        centered
        style={[
          styles.container,
          {
            backgroundColor:
              variant === "contained"
                ? bgcolor !== undefined
                  ? bgcolor
                  : colors.primary
                : "transparent",
            borderColor: bgcolor !== undefined ? bgcolor : colors.primary,
            borderRadius: wp(radius),
          },
        ]}
      >
        <Box>
          {startAdornment !== undefined &&
            (typeof startAdornment === "function" ? (
              startAdornment()
            ) : (
              <FontAwesomeIcon
                color={variant === "contained" ? colors.light : colors.primary}
                size={wp(16)}
                icon={startAdornment}
              />
            ))}
        </Box>
        <Box>
          <Text.Medium
            size={16}
            color={
              variant === "contained"
                ? colors.light
                : color !== undefined
                ? color
                : colors.primary
            }
            style={styles.label}
          >
            {children}
          </Text.Medium>
        </Box>
        <Box>
          {endAdornment !== undefined &&
            (typeof endAdornment === "function" ? (
              endAdornment()
            ) : (
              <FontAwesomeIcon
                color={
                  variant === "contained"
                    ? colors.light
                    : color !== undefined
                    ? color
                    : colors.primary
                }
                size={wp(16)}
                icon={endAdornment}
              />
            ))}
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const makeStyles = () =>
  StyleSheet.create({
    root: { width: "100%" },
    container: {
      paddingVertical: wp(16),
      paddingHorizontal: wp(22),
      borderWidth: 1,
    },
    label: {},
  });
