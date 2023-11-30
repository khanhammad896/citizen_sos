import React, { useMemo, forwardRef } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import { wp } from "@utils/helper";
import { PX } from "@utils/constants";
import CustomBackdrop from "@components/custom-backdrop";
import { Box } from "@components/layout";
import { useTranslation } from "react-i18next";
import { tokens } from "@locales/tokens";
import { PrimaryButton } from "../buttons";
import { Text } from "../typography";

interface DeleteModalProps {
  mediaType: "audio" | "image" | "video";
  handleDelete: (mediaType: "audio" | "image" | "video") => void;
}

const DeleteModal = forwardRef<BottomSheetModal, DeleteModalProps>(
  ({ handleDelete, mediaType }, ref) => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const { colors, direction } = theme;
    const snapPoints = useMemo(() => ["20%", "20%"], []);
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
          <Box centered style={{ marginBottom: wp(24) }}>
            <Text.Medium aligned="center" size={18}>
              {t(tokens.evidence.want)} {direction === "ltr" && `${mediaType}?`}
            </Text.Medium>
          </Box>
          <PrimaryButton
            onPress={() => handleDelete(mediaType)}
            bgcolor={colors.danger}
          >
            {t(tokens.common.delete)}
          </PrimaryButton>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default DeleteModal;

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
});
