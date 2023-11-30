import { ColorValue, Image, StyleSheet, ViewProps } from "react-native";
import React, { FC } from "react";
import { Box } from "@components/layout";
import { useTheme } from "@hooks/use-theme";
import { getInitials, wp } from "@utils/helper";
import { Text } from "@components/ui/typography";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ThemeConfig } from "@theme/index";

interface PrimaryAvatarProps extends ViewProps {
  size?: number;
  bgcolor?: ColorValue;
  name?: string;
  uri?: string;
  icon?: IconProp | (() => React.ReactNode);
  radius?: number;
  stroke?: boolean;
}

const PrimaryAvatar: FC<PrimaryAvatarProps> = ({
  size = 40,
  name,
  bgcolor = "transparent",
  uri,
  icon = ["fas", "user"],
  radius = 14,
  stroke = true,
  style,
  ...props
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const initials = getInitials(name ?? "");

  return (
    <Box
      centered
      justified
      style={[
        styles.root,
        {
          width: wp(size),
          height: wp(size),
          borderRadius: wp(radius),
          backgroundColor: bgcolor,
          borderWidth: stroke ? (size > 50 ? 2 : 1) : 0,
        },
        style,
      ]}
      {...props}
    >
      {name !== undefined ? (
        <Text.Medium size={(size * 16) / 40} color={colors.light}>
          {initials}
        </Text.Medium>
      ) : uri !== undefined ? (
        <Image
          source={{ uri }}
          resizeMode="cover"
          style={{ width: size, height: size }}
        />
      ) : typeof icon === "function" ? (
        icon()
      ) : (
        <FontAwesomeIcon
          size={wp(size / 2)}
          icon={icon}
          color={colors.primary}
        />
      )}
    </Box>
  );
};

export default PrimaryAvatar;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      overflow: "hidden",

      borderColor: colors.light,
    },
  });
