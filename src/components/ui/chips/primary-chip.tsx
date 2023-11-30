import { View, type ViewProps, StyleSheet } from "react-native";
import React, { type FC } from "react";
import { transColor, wp } from "@utils/helper";
import { useTheme } from "@hooks/use-theme";
import { Text } from "../typography";

interface StatusChipProps extends ViewProps {
  color?: string;
}

const Chip: FC<StatusChipProps> = ({ children, color, style }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles();
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor:
            color !== undefined
              ? transColor(color, 0.1)
              : transColor(colors.primary, 0.1),
        },
        style,
      ]}
    >
      <Text.Medium
        spacing={-0.16}
        color={color !== undefined ? color : colors.primary}
        size={8}
      >
        {children}
      </Text.Medium>
    </View>
  );
};

export default Chip;

const makeStyles = () =>
  StyleSheet.create({
    root: {
      paddingVertical: wp(4),
      paddingHorizontal: wp(10),
      borderRadius: 20,
    },
  });
