import React, { useMemo, forwardRef } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import { showToast, wp } from "@utils/helper";
import { Box } from "@components/layout";
import { PX } from "@utils/constants";
import CustomBackdrop from "@components/custom-backdrop";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useDeleteUserMutation } from "@framework/basic-rest/profile/use-delete-profile";
import LoaderKit from "react-native-loader-kit";
import { useAuth } from "@hooks/use-auth";
import { useTranslation } from "react-i18next";
import { tokens } from "@locales/tokens";
import { Text } from "../typography";
import { PrimaryButton } from "../buttons";

interface ConfirmationModalProps {
  onClose?: () => void;
}

const ConfirmationModal = forwardRef<BottomSheetModal, ConfirmationModalProps>(
  ({ onClose }, ref) => {
    const theme = useTheme();
    const styles = makeStyles(theme);
    const { colors } = theme;
    const snapPoints = useMemo(() => ["75%", "75%"], []);
    const { mutate: DeleteUser, isPending } = useDeleteUserMutation();
    const { signOut } = useAuth();
    const { t } = useTranslation();

    const handleDeleteUser = () => {
      DeleteUser(undefined, {
        onSuccess: (res) => {
          if (res.error)
            return showToast(
              "error",
              typeof res.error_messages === "string"
                ? res.error_messages
                : res.message,
            );
          showToast("success", "Your profile has been deleted!");
          return signOut();
        },
        onError: () => {
          showToast(
            "error",
            "Your account can't be deleted right now. Please try again",
          );
        },
      });
    };

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
            <FontAwesomeIcon
              icon={["fal", "user-slash"]}
              color={colors.danger}
              size={wp(100)}
            />
            <Text.Medium
              aligned="center"
              color={colors.danger}
              size={20}
              spacing={-0.2}
              style={{ maxWidth: wp(272), marginTop: wp(41) }}
            >
              {t(tokens.profile.permanently)}
            </Text.Medium>
            <Text.Regular
              color={colors.night}
              size={16}
              style={styles.message}
              spacing={-0.16}
              aligned="center"
            >
              {t(tokens.profile.removal)}
            </Text.Regular>
            <Text.Regular
              color={colors.success}
              size={16}
              spacing={-0.16}
              aligned="center"
              style={{
                marginTop: wp(24),
                lineHeight: wp(22),
                maxWidth: wp(240),
              }}
            >
              {t(tokens.profile.assured)}
            </Text.Regular>
          </Box>
          <PrimaryButton
            onPress={handleDeleteUser}
            bgcolor={colors.danger}
            style={{ marginBottom: wp(10) }}
          >
            {isPending ? (
              <LoaderKit
                style={{ width: wp(22), height: wp(22) }}
                name="LineScale"
                size={wp(22)}
                color={colors.light}
              />
            ) : (
              t(tokens.profile.account)
            )}
          </PrimaryButton>
          <PrimaryButton
            variant="outlined"
            onPress={onClose}
            bgcolor={colors.secondary}
            color={colors.secondary}
          >
            {t(tokens.common.cancel)}
          </PrimaryButton>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default ConfirmationModal;

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
    paddingTop: wp(12),
    paddingBottom: wp(16),
    flex: 1,
  },
  message: {
    marginTop: wp(24),
    lineHeight: wp(24),
    width: wp(355),
    maxWidth: wp(272),
  },
});
