import { StyleSheet, View } from "react-native";
import React, { FC, PropsWithChildren } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useDrawerProgress } from "@react-navigation/drawer";
import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import FocusAwareStatusBar from "@components/custom-statusbar";

const DrawerLayout: FC<PropsWithChildren> = ({ children }) => {
  // const isDrawerOpen = useDrawerStatus();
  const sv = useDrawerProgress();
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);

  // useEffect(() => {
  //   if (isDrawerOpen === "open") {
  //     sv.value = withTiming(1);
  //   } else {
  //     sv.value = withTiming(0);
  //   }
  // }, [isDrawerOpen]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(sv.value, [0, 1], [1, 0.9]),
      },
    ],
    borderRadius: interpolate(sv.value, [0, 1], [0, 20]),
    borderWidth: interpolate(sv.value, [0, 1], [0, 3]),
    marginLeft: interpolate(sv.value, [0, 1], [0, 10]),
  }));

  return (
    <>
      <FocusAwareStatusBar />
      <View style={styles.container}>
        <Animated.View
          style={[
            {
              flex: 1,
              overflow: "hidden",
              elevation: 20,
              shadowColor: colors.night,
              shadowOpacity: 0.5,
              shadowOffset: {
                width: -10,
                height: 24,
              },
              shadowRadius: 20,
              borderColor: colors.light,
            },
            rStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </>
  );
};

export default DrawerLayout;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenWrapper: {
      flex: 1,
      overflow: "hidden",
      elevation: 20,
      shadowColor: colors.night,
      shadowOpacity: 0.5,
      shadowOffset: {
        width: -10,
        height: 24,
      },
      shadowRadius: 20,
      borderColor: colors.light,
    },
  });
