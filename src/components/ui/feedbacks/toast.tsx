import { Box } from "@components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@hooks/use-theme";
import { PX, SCREEN_WIDTH } from "@utils/constants";
import { wp } from "@utils/helper";
import { FC } from "react";
import { ToastConfigParams } from "react-native-toast-message";
import { Text } from "../typography";

export const ErrorToast: FC<ToastConfigParams<any>> = ({ text1 }) => {
  const { colors } = useTheme();
  return (
    <Box
      row
      centered
      style={{
        backgroundColor: colors.warn,
        width: SCREEN_WIDTH - 2 * wp(PX),
        paddingHorizontal: wp(24),
        paddingVertical: wp(12),
        borderRadius: wp(16),
      }}
    >
      <FontAwesomeIcon
        color={colors.light}
        size={wp(20)}
        icon={["fal", "triangle-exclamation"]}
      />
      <Text.Regular
        color={colors.light}
        style={{ marginLeft: wp(14), flex: 1 }}
        numberOfLines={2}
      >
        {text1}
      </Text.Regular>
    </Box>
  );
};

export const SuccessToast: FC<ToastConfigParams<any>> = ({ text1 }) => {
  const { colors } = useTheme();
  return (
    <Box
      row
      centered
      style={{
        backgroundColor: colors.success,
        width: SCREEN_WIDTH - 2 * wp(PX),
        paddingHorizontal: wp(24),
        paddingVertical: wp(12),
        borderRadius: wp(16),
      }}
    >
      <FontAwesomeIcon
        color={colors.light}
        size={wp(20)}
        icon={["fal", "hexagon-check"]}
      />
      <Text.Regular
        color={colors.light}
        style={{ marginLeft: wp(14), flex: 1 }}
        numberOfLines={2}
      >
        {text1}
      </Text.Regular>
    </Box>
  );
};
