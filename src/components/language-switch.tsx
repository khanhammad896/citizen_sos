import {
  ColorValue,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { wp } from "@utils/helper";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useUi } from "@hooks/use-ui";
import { Languages } from "@utils/types";
import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import { Box } from "@components/layout";

const LANGUAGES = [
  {
    id: 0,
    label: "English",
  },
  {
    id: 1,
    label: "اردو",
  },
];

interface LanguageSwitchProps extends ViewProps {
  color?: ColorValue;
}

const LanguageSwitch: FC<LanguageSwitchProps> = ({
  color,
  style,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const active = useSharedValue(0);
  const sliderRef = useRef<View>(null);
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const { changeLanguage, language } = useUi();
  const theme = useTheme();
  const { fonts, colors } = theme;
  const styles = makeStyles(theme);

  const handleTabChange = (index: number) => {
    if (index === 0) {
      active.value = withTiming(1, { duration: 300 });
      changeLanguage(Languages.ENGLISH);
    }
    if (index === 1) {
      active.value = withTiming(sliderWidth / 2 - wp(2), { duration: 300 });
      changeLanguage(Languages.URDU);
    }
    setActiveIndex(index);
  };

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setSliderWidth(width);
    },
    [sliderWidth],
  );

  useEffect(() => {
    if (language === "ur") {
      handleTabChange(1);
    }
  }, [sliderWidth]);
  return (
    <Box row full style={[styles.root, style]} {...props}>
      <View ref={sliderRef} style={styles.sliderContainer} onLayout={onLayout}>
        <Animated.View
          style={[
            styles.slider,
            {
              backgroundColor: color !== undefined ? color : colors.primary,
              transform: [
                {
                  translateX: active,
                },
              ],
            },
          ]}
        />
      </View>
      {LANGUAGES.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.item]}
            onPress={() => handleTabChange(index)}
          >
            <Box centered justified stretched>
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? colors.light : colors.fade,
                    fontFamily: isActive ? fonts.medium : fonts.bold,
                  },
                ]}
              >
                {item.label}
              </Text>
            </Box>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};

export default LanguageSwitch;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      borderWidth: 1,
      borderRadius: wp(10),
      borderColor: colors.zinc,
      padding: wp(3),
    },
    item: {
      flex: 1,
      height: wp(45),
    },
    sliderContainer: {
      position: "absolute",
      top: wp(3),
      left: wp(3),
      width: "100%",
      height: "100%",
      borderRadius: wp(10),
      zIndex: -1,
    },
    slider: {
      width: "50%",
      height: "100%",
      borderRadius: wp(10),
    },
    label: {
      fontSize: wp(16),
    },
  });
