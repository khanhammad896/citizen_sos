import {
  FlatList,
  GestureResponderEvent,
  ImageBackground,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC } from "react";
import { Box, DrawerLayout, RootLayout } from "@components/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { DrawerActions } from "@react-navigation/native";
import { format, parse } from "date-fns";
import { useDrawerStatus } from "@react-navigation/drawer";

import { useTheme } from "@hooks/use-theme";
import { PX, SCREEN_HEIGHT, SCREEN_WIDTH } from "@utils/constants";
import { generateRandomColor, getCaseStatus, wp } from "@utils/helper";
import { ThemeConfig } from "@theme/index";
import Cover from "@assets/media/cover.png";
import { AppDrawerScreenProps, CaseSchema } from "@utils/types";
import { Text } from "@components/ui/typography";
import { Chip } from "@components/ui/chips";
import { useUserSOSQuery } from "@framework/basic-rest/leads/get-user-sos";
import { ListSkeleton } from "@components/ui/progress";
import Empty from "@assets/media/empty.svg";
import { PrimaryButton } from "@components/ui/buttons";
import { useTranslation } from "react-i18next";
import { tokens } from "@locales/tokens";

type HistoryProps = AppDrawerScreenProps<"history">;

const EmptyComponent = ({
  onPress,
}: {
  onPress: (e: GestureResponderEvent) => void;
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();
  return (
    <Box stretched centered justified>
      <Empty height={wp(138)} />
      <Text.Bold size={20} color={colors.fade}>
        {t(tokens.history.reported)}
      </Text.Bold>
      <Text.Regular
        aligned="center"
        style={{
          lineHeight: wp(22),
          marginTop: wp(12),
          maxWidth: wp(256),
        }}
        size={16}
        color={colors.night}
      >
        {t(tokens.history.easily)}
      </Text.Regular>
      <PrimaryButton
        style={{ maxWidth: SCREEN_WIDTH / 2, marginTop: wp(20) }}
        onPress={onPress}
      >
        {t(tokens.history.report)}
      </PrimaryButton>
    </Box>
  );
};

const ReportItem: FC<{ report: CaseSchema }> = ({ report }) => {
  const theme = useTheme();
  const { colors, direction } = theme;
  const styles = makeStyles(theme);
  const timestamp = parse(report.time_id, "yyyy-MM-dd HH:mm:ss", new Date());
  const date = format(timestamp, "dd MMM, yyyy");
  const time = format(timestamp, "hh:mm a");
  const { t } = useTranslation();

  return (
    <Box full end={direction === "rtl"} style={styles.reportItem}>
      <Box row centered>
        <Text.Medium
          size={16}
          color={colors[getCaseStatus(report.case_status).color]}
          style={{ marginRight: wp(9) }}
        >
          {t(getCaseStatus(report.case_status).label)}
        </Text.Medium>
        {Boolean(report.level2_case_nature) && (
          <Chip color={generateRandomColor()}>{report.level2_case_nature}</Chip>
        )}
      </Box>
      <Box row centered style={{ marginTop: wp(7) }}>
        <Text.Regular color={colors.fade} spacing={-0.28}>
          {date}
        </Text.Regular>
        <View
          style={{
            width: 1,
            height: wp(12),
            backgroundColor: colors.fade,
            marginHorizontal: wp(8),
          }}
        />
        <Text.Regular color={colors.fade} spacing={-0.28}>
          {time}
        </Text.Regular>
      </Box>
    </Box>
  );
};

const renderItem = ({ item }: { item: CaseSchema }) => {
  return <ReportItem report={item} />;
};

const History: FC<HistoryProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const insets = useSafeAreaInsets();
  const isDrawerOpen = useDrawerStatus() === "open";
  const { data, isFetching, refetch, isRefetching } = useUserSOSQuery();
  const { t } = useTranslation();

  return (
    <DrawerLayout>
      <RootLayout cover={false} safe={false} style={{ paddingHorizontal: 0 }}>
        <Box stretched>
          <View style={styles.cover}>
            <ImageBackground source={Cover} style={styles.background}>
              <Box
                centered
                between
                row
                style={[
                  styles.header,
                  {
                    marginTop: Platform.OS === "android" ? insets.top : wp(20),
                  },
                ]}
              >
                <Box
                  centered
                  full
                  row
                  between
                  style={{
                    marginBottom: Platform.select({ android: wp(30) }),
                  }}
                >
                  <Box>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.dispatch(DrawerActions.openDrawer())
                      }
                    >
                      <FontAwesomeIcon
                        icon={["fal", isDrawerOpen ? "xmark" : "bars-sort"]}
                        color={colors.light}
                        size={wp(22)}
                      />
                    </TouchableOpacity>
                  </Box>
                  <Text.Medium
                    aligned="center"
                    color={colors.light}
                    size={18}
                    spacing={-0.36}
                  >
                    {t(tokens.nav.history)}
                  </Text.Medium>
                  <Box>
                    <TouchableOpacity
                      onPress={() => refetch()}
                      disabled={isFetching}
                    >
                      <FontAwesomeIcon
                        icon={["fal", "rotate-right"]}
                        color={isFetching ? colors.zinc : colors.light}
                        size={wp(20)}
                      />
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>
            </ImageBackground>
          </View>
          <Box full centered style={styles.content}>
            {!isFetching &&
              data !== undefined &&
              data?.data !== undefined &&
              Boolean(data.data.length) && (
                <>
                  <Text.Bold size={16}>
                    {data.data.length}{" "}
                    <Text.Regular size={16}>
                      {t(tokens.history.cases)}
                    </Text.Regular>
                  </Text.Bold>
                  <Text.Medium size={18}>
                    {t(tokens.history.incidents)}
                  </Text.Medium>
                </>
              )}
            {isFetching ? (
              <ListSkeleton />
            ) : (
              <FlatList
                contentContainerStyle={{ minHeight: SCREEN_HEIGHT / 1.5 }}
                style={styles.reportList}
                data={data !== undefined ? data.data : []}
                renderItem={renderItem}
                keyExtractor={(r, i) => String(i)}
                ItemSeparatorComponent={() => (
                  <View style={{ marginVertical: wp(6) }} />
                )}
                ListEmptyComponent={
                  <EmptyComponent
                    onPress={() =>
                      navigation.navigate("report", { screen: "home" })
                    }
                  />
                }
                refreshControl={
                  <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={refetch}
                    colors={[colors.secondary]}
                    title="Updating Cases"
                    tintColor={colors.secondary}
                    titleColor={colors.night}
                  />
                }
              />
            )}
          </Box>
        </Box>
      </RootLayout>
    </DrawerLayout>
  );
};

export default History;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    cover: {
      position: "absolute",
      zIndex: 20,
      top: 0,
      width: SCREEN_WIDTH,
      height: wp(116),
      borderBottomLeftRadius: wp(45),
      borderBottomRightRadius: wp(45),
      overflow: "hidden",
    },
    background: {
      width: "100%",
      height: "100%",
    },
    header: {
      paddingHorizontal: wp(PX),
      height: "100%",
    },
    content: {
      marginTop: wp(116),
      paddingHorizontal: wp(PX),
      paddingVertical: wp(20),
    },
    reportList: {
      width: "100%",
      marginTop: wp(24),
      marginBottom: wp(36),
    },
    reportItem: {
      backgroundColor: colors.light,
      paddingHorizontal: wp(18),
      paddingVertical: wp(12),
      borderWidth: 1,
      borderColor: colors.zinc,
      borderRadius: wp(16),
    },
  });
