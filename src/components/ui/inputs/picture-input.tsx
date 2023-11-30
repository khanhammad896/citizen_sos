import { StyleSheet, TouchableOpacity } from "react-native";
import React, { FC, useCallback } from "react";
import * as ImagePicker from "react-native-image-picker";

import { useTheme } from "@hooks/use-theme";
import { wp } from "@utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Text } from "@components/ui/typography";
import { ImageAssetType } from "@utils/types";
import { useTranslation } from "react-i18next";
import { tokens } from "@locales/tokens";

interface PictureInputProps {
  onChange: (image: ImageAssetType) => void;
  disable?: boolean;
}

const PictureInput: FC<PictureInputProps> = ({ onChange, disable }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles();
  const { t } = useTranslation();

  const handleImageCapture = useCallback(() => {
    ImagePicker.launchCamera({
      mediaType: "photo",
      includeBase64: false,
      includeExtra: false,
    }).then((data) => {
      const { assets } = data as ImagePicker.ImagePickerResponse & {
        assets: ImageAssetType[];
      };
      onChange(assets[0]);
    });
  }, []);

  return (
    <TouchableOpacity
      disabled={Boolean(disable)}
      style={styles.actionButton}
      onPress={handleImageCapture}
    >
      <FontAwesomeIcon icon={["fal", "camera"]} color={colors.light} />
      <Text.Medium
        style={{ marginTop: wp(9) }}
        color={colors.light}
        size={10}
        spacing={-0.2}
      >
        {t(tokens.evidence.picture)}
      </Text.Medium>
    </TouchableOpacity>
  );
};

export default PictureInput;

const makeStyles = () =>
  StyleSheet.create({
    actionButton: {
      width: "100%",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
