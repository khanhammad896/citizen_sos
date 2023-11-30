import { StyleSheet } from "react-native";
import React from "react";
import { SCREEN_WIDTH } from "@utils/constants";
import { Box } from "@components/layout";
import { useTheme } from "@hooks/use-theme";
import { wp } from "@utils/helper";
import LoaderKit from "react-native-loader-kit";

const Loader = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles();
  return (
    <Box centered justified style={[styles.root]}>
      <LoaderKit
        style={{ width: wp(52), height: wp(52) }}
        name="LineScale"
        size={wp(52)}
        color={colors.light}
      />
    </Box>
  );
};

export default Loader;

const makeStyles = () =>
  StyleSheet.create({
    root: {
      position: "absolute",
      width: SCREEN_WIDTH,
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.85)",
      zIndex: 99999,
    },
  });
