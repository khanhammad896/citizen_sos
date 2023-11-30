import React, { useMemo, forwardRef } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import { wp } from "@utils/helper";
import { Box } from "@components/layout";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { PX } from "@utils/constants";
import Confetti from "@assets/media/confetti.json";
import CustomBackdrop from "@components/custom-backdrop";
import { useTranslation } from "react-i18next";
import { tokens } from "@locales/tokens";
import { PrimaryButton } from "../buttons";
import { Text } from "../typography";

interface SuccessModalProps {
  onClose?: () => void;
}

const SuccessModal = forwardRef<BottomSheetModal, SuccessModalProps>(
  ({ onClose }, ref) => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const { colors } = theme;
    const snapPoints = useMemo(() => ["75%", "75%"], []);
    const { t } = useTranslation();

    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        backdropComponent={CustomBackdrop}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.background}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.content}>
          <Box centered stretched>
            <View style={styles.gifContainer}>
              <LottieView
                style={{ width: wp(196), height: wp(196) }}
                source={Confetti}
                autoPlay
                loop
                resizeMode="cover"
              />
            </View>
            <Text.Medium
              aligned="center"
              color={colors.success}
              size={20}
              spacing={-0.2}
              style={{ maxWidth: wp(272), marginTop: wp(-20) }}
            >
              {t(tokens.evidence.appreciate)}
            </Text.Medium>
            <Text.Regular
              color={colors.night}
              size={16}
              style={styles.message}
              spacing={-0.16}
              aligned="center"
            >
              {t(tokens.evidence.respond)}
            </Text.Regular>
            <Text.Regular
              color={colors.night}
              size={16}
              spacing={-0.16}
              aligned="center"
              style={{
                marginTop: wp(42),
                lineHeight: wp(22),
                maxWidth: wp(250),
              }}
            >
              {t(tokens.evidence.identity)}
            </Text.Regular>
          </Box>
          <PrimaryButton onPress={onClose}>
            {t(tokens.common.close)}
          </PrimaryButton>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default SuccessModal;

const makeStyles = ({ colors }: ThemeConfig) => ({
  background: {
    borderRadius: 50,
    backgroundColor: colors.background,
  },
  indicator: {
    backgroundColor: colors.zinc,
    width: wp(77),
    height: wp(5),
    borderRadius: 5,
  },
  content: {
    paddingHorizontal: wp(PX),
    paddingTop: wp(17),
    paddingBottom: wp(24),
    flex: 1,
  },
  gifContainer: {
    marginBottom: wp(4),
  },
  message: {
    marginTop: wp(24),
    lineHeight: wp(24),
    width: wp(355),
    maxWidth: wp(272),
  },
});
