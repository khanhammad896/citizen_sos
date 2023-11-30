import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import React, { FC, PropsWithChildren, useMemo } from "react";
import { PX, SCREEN_HEIGHT, SCREEN_WIDTH } from "@utils/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Cover from "@assets/media/background.png";
import { wp } from "@utils/helper";
import { ThemeConfig } from "@theme/index";
import { useTheme } from "@hooks/use-theme";

interface RootLayoutProps extends ViewProps {
  scrollView?: boolean;
  cover?: boolean;
  safe?: boolean;
}

const RootLayout: FC<PropsWithChildren<RootLayoutProps>> = ({
  scrollView,
  cover = true,
  children,
  safe = true,
  style,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const height = useMemo(() => SCREEN_HEIGHT + insets.top, [insets.top]);
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: safe ? insets.top : 0,
          paddingHorizontal: scrollView ? 0 : wp(PX),
          // height,
          flex: 1,
        },
        style,
      ]}
      {...props}
    >
      {cover && (
        <ImageBackground
          source={Cover}
          resizeMode="cover"
          style={[styles.cover, { height }]}
        />
      )}
      {scrollView ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: wp(PX),
            flexGrow: 1,
          }}
        >
          {cover ? (
            <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
          ) : (
            children
          )}
        </ScrollView>
      ) : cover ? (
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      ) : (
        children
      )}
    </View>
  );
};

export default RootLayout;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      width: SCREEN_WIDTH,
      backgroundColor: colors.background,
    },
    cover: {
      position: "absolute",
      width: SCREEN_WIDTH,
    },
  });
