import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import React, { forwardRef } from "react";
import { ThemeConfig } from "@theme/index";
import { useTheme } from "@hooks/use-theme";
import { Box } from "@components/layout";
import { wp } from "@utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { ColorType } from "@utils/types";
import { Text } from "../typography";

interface PrimaryInputProps extends TextInputProps {
  mt?: number;
  icon?: IconName;
  stroke?: boolean;
  endAdornment?: () => React.ReactNode;
  errorText?: string;
  errorColor?: ColorType;
}

const PrimaryInput = forwardRef<TextInput, PrimaryInputProps>(
  (
    {
      mt = 10,
      icon,
      style,
      stroke = true,
      endAdornment,
      errorText,
      errorColor = "danger",
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = makeStyles(theme);
    return (
      <View style={{ marginTop: wp(mt) }}>
        <Box
          row
          centered={!props.multiline}
          full
          style={[styles.root, { borderWidth: stroke ? 1 : 0 }]}
        >
          {icon !== undefined && (
            <Box
              style={{
                marginRight: wp(14),
                marginTop: props.multiline ? wp(14) : 0,
              }}
            >
              <FontAwesomeIcon icon={["fal", icon]} color={colors.zinc} />
            </Box>
          )}
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={colors.off}
            {...props}
          />
          <Box
            style={{
              marginLeft: wp(14),
              marginTop: props.multiline ? wp(14) : 0,
            }}
          >
            {endAdornment !== undefined && (
              <Box
                style={{
                  marginRight: wp(14),
                  marginTop: props.multiline ? wp(14) : 0,
                }}
              >
                {endAdornment()}
              </Box>
            )}
          </Box>
        </Box>
        {Boolean(errorText) && (
          <Text.Medium
            color={colors[errorColor]}
            size={12}
            style={styles.helperText}
          >
            {errorText}
          </Text.Medium>
        )}
      </View>
    );
  },
);

export default PrimaryInput;

const makeStyles = ({ colors, fonts }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      borderColor: colors.zinc,
      borderRadius: wp(10),
      paddingHorizontal: wp(18),
      backgroundColor: colors.light,
    },
    input: {
      flex: 1,
      minHeight: wp(50),
      fontSize: wp(16),
      color: colors.night,
      fontFamily: fonts.regular,
    },
    helperText: {
      marginTop: wp(4),
      marginLeft: wp(8),
    },
  });
