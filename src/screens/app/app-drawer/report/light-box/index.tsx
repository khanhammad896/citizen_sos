import { Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import { Box, DrawerLayout, RootLayout } from "@components/layout";
import { ReportScreenProps } from "@utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { wp } from "@utils/helper";
import { PX } from "@utils/constants";
import Video from "react-native-video";

type LightBoxProps = ReportScreenProps<"light-box">;

const LightBox: FC<LightBoxProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const { type, uri } = route.params;
  return (
    <DrawerLayout>
      <RootLayout cover={false} style={styles.root}>
        <Box stretched>
          <Box style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={["fas", "arrow-left"]}
                color={colors.light}
                size={wp(22)}
              />
            </TouchableOpacity>
          </Box>
          <Box full stretched>
            {type === "image/jpeg" && (
              <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            )}
            {type === "video/mp4" && (
              <Video
                source={{ uri }}
                resizeMode="contain"
                style={{ width: "100%", height: "100%" }}
                controls
              />
            )}
          </Box>
        </Box>
      </RootLayout>
    </DrawerLayout>
  );
};

export default LightBox;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      backgroundColor: colors.night,
      paddingHorizontal: 0,
    },
    header: {
      paddingHorizontal: wp(PX),
      paddingVertical: wp(PX),
    },
  });
