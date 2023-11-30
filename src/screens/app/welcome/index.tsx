import {
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, RootLayout } from "@components/layout";
import { hp, isRight, wp } from "@utils/helper";
import Logo from "@components/logo";
import { PX, SCREEN_WIDTH } from "@utils/constants";
import { AppScreenProps, WelcomeItemType } from "@utils/types";
import { Text } from "@components/ui/typography";
import LanguageSwitch from "@components/language-switch";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import { useAuth } from "@hooks/use-auth";
import Illustration0 from "@assets/media/illustration0.svg";
import Illustration1 from "@assets/media/illustration1.svg";
import Illustration2 from "@assets/media/illustration2.svg";
import { tokens } from "../../../locales/tokens";

type WelcomeProps = AppScreenProps<"welcome">;

const ITEM_WIDTH = SCREEN_WIDTH - 2 * wp(PX);
const ITEM_HEIGHT = hp(411);

const ITEMS: WelcomeItemType[] = [
  {
    id: "0",
    title: tokens.welcome.welcome,
    description: tokens.welcome.help,
    illustration: Illustration0,
    height: 199,
  },
  {
    id: "1",
    title: tokens.welcome.easy,
    description: tokens.welcome.report,
    illustration: Illustration1,
    height: 174,
  },
  {
    id: "2",
    title: tokens.welcome.choose,
    illustration: Illustration2,
    height: 122,
  },
];

function Slide({ item, index }: { item: WelcomeItemType; index: number }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { direction } = theme;
  const styles = makeStyles(theme);

  return (
    <Box centered style={styles.item}>
      <Box stretched>
        <item.illustration height={hp(item.height)} />
      </Box>
      {index === 2 && (
        <LanguageSwitch style={{ marginTop: wp(16), marginBottom: wp(27) }} />
      )}
      <Box end={isRight(direction)} full style={{ minHeight: wp(100) }}>
        <Text.Medium size={20} spacing={-0.4}>
          {t(item.title)}
        </Text.Medium>
        {Boolean(item.description) && (
          <Text.Regular size={20} spacing={-0.4}>
            {t(item.description ?? "")}
          </Text.Regular>
        )}
      </Box>
    </Box>
  );
}

const renderItem = ({
  item,
  index,
}: {
  item: WelcomeItemType;
  index: number;
}) => {
  return <Slide item={item} index={index} />;
};

const Welcome: FC<WelcomeProps> = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef<FlatList>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const { onBoard } = useAuth();

  const handleSlideChange = useCallback(() => {
    if (currentSlide === 2) return onBoard();
    setCurrentSlide((prevIndex) => prevIndex + 1);
    return sliderRef.current?.scrollToOffset({
      offset: (currentSlide + 1) * ITEM_WIDTH,
      animated: true,
    });
  }, [currentSlide]);

  return (
    <RootLayout>
      <Box centered stretched style={styles.root}>
        <Logo />
        <View style={styles.swiperContainer}>
          <FlatList
            ref={sliderRef}
            onScroll={(e) => {
              scrollX.setValue(e.nativeEvent.contentOffset.x);
            }}
            data={ITEMS}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled
            onMomentumScrollEnd={(ev) => {
              setCurrentSlide(
                Math.floor(ev.nativeEvent.contentOffset.x / ITEM_WIDTH),
              );
            }}
          />
        </View>
        <Box style={{ paddingHorizontal: wp(PX) }} full row centered between>
          <TouchableOpacity onPress={onBoard}>
            <Text.Regular color={colors.light} size={16} spacing={-0.32}>
              {t(tokens.welcome.skip)}
            </Text.Regular>
          </TouchableOpacity>
          <Box row>
            {[0, 1, 2].map((_, index) => {
              const inputRange = [0, ITEM_WIDTH, ITEM_WIDTH * 2];
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      marginHorizontal: index === 1 ? wp(6) : 0,
                      width: scrollX.interpolate({
                        inputRange,
                        outputRange: inputRange.map((input, i) =>
                          i === index ? wp(20) : wp(6),
                        ),
                      }),
                    },
                  ]}
                />
              );
            })}
          </Box>
          <TouchableOpacity onPress={handleSlideChange}>
            <Box
              centered
              justified
              style={[
                styles.iconButton,
                { ...(currentSlide === 2 && { borderColor: colors.light }) },
              ]}
            >
              <FontAwesomeIcon
                icon={["far", "arrow-right"]}
                color={colors.light}
              />
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    </RootLayout>
  );
};

export default Welcome;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      paddingVertical: wp(36),
    },
    swiperContainer: {
      height: ITEM_HEIGHT,
      marginVertical: wp(40),
      backgroundColor: colors.light,
      borderRadius: 50,
      overflow: "hidden",
    },
    item: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      paddingHorizontal: wp(32),
      paddingVertical: wp(32),
    },
    iconButton: {
      width: wp(53),
      height: wp(53),
      borderRadius: wp(12),
      borderColor: colors.light,
      borderWidth: 1,
    },
    dot: {
      width: wp(6),
      height: wp(6),
      borderRadius: wp(3),
      backgroundColor: colors.light,
    },
  });
