import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import GeoLocation from "react-native-geolocation-service";

import { Box, DrawerLayout, Header, RootLayout } from "@components/layout/";
import { ReportScreenProps } from "@utils/types";
import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import { showToast, wp } from "@utils/helper";
import Title from "@assets/media/title.svg";
import TitleUr from "@assets/media/title-ur.svg";
import { Text } from "@components/ui/typography";
import { tokens } from "@locales/tokens";
import ReportButtonEn from "@assets/media/report-button-en.svg";
import { useFocusEffect } from "@react-navigation/native";
import { Loader } from "@components/ui/progress";
import { useSaveLeadsMutation } from "@framework/basic-rest/leads/use-save-leads";
import LoaderKit from "react-native-loader-kit";
import { queryClient } from "App";
import { API_ENDPOINTS } from "@utils/constants";

type ReportProps = ReportScreenProps<"home">;

const requestLocationPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocation Permission",
          message: "Can we access your location?",
          buttonNeutral: "Ask me later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use Geolocation");
        return true;
      }
      console.log("You cannot use Geolocation");
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  } else {
    const permission = GeoLocation.requestAuthorization("whenInUse");
    return permission;
  }
};

const Report: FC<ReportProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors, direction } = theme;
  const styles = makeStyles(theme);
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ lat: string; lng: string } | null>(
    null,
  );
  const { mutate: SaveLeads, isPending } = useSaveLeadsMutation();
  const [isLoading, setIsLoading] = useState(true);

  // Get current location of user on screen mount
  const getLocation = async () => {
    try {
      setIsLoading(true);
      const result = await requestLocationPermission();
      if (result) {
        GeoLocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: String(pos.coords.latitude),
              lng: String(pos.coords.longitude),
            });
            setIsLoading(false);
          },
          (error) => {
            console.log(error.code, error.message);
            setLocation(null);
            setIsLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        setIsLoading(false);
        showToast(
          "error",
          "We can't retrieve your location. Please allow us to fetch your current location!",
        );
      }
    } catch (err) {
      console.error(err);
      setLocation(null);
      setIsLoading(false);
    }
  };

  const handleSendLead = async () => {
    if (location !== null) {
      SaveLeads(location, {
        onSuccess: (res) => {
          if (res.error)
            return showToast(
              "error",
              typeof res.error_messages === "string"
                ? res.error_messages
                : res.message,
            );
          setLocation(null);
          queryClient.invalidateQueries({
            queryKey: [API_ENDPOINTS.LEADS.USER_SOS],
          });
          return navigation.navigate("evidence", { lead_id: res.data });
        },
        onError: () =>
          showToast(
            "error",
            "Not been able to send your SOS call right now. Please try again!",
          ),
      });
    } else {
      showToast(
        "error",
        "Couldn't identify your location. Please enable location to proceed",
      );
      getLocation();
    }
  };

  useFocusEffect(
    useCallback(() => {
      getLocation();
    }, []),
  );

  return (
    <>
      {isPending && <Loader />}
      <DrawerLayout>
        <RootLayout>
          <Header navigation={navigation} />
          <Box centered stretched style={styles.root}>
            {direction === "ltr" ? (
              <Title width={wp(208)} height={wp(50)} />
            ) : (
              <TitleUr width={wp(208)} height={wp(50)} />
            )}
            <Box full centered stretched>
              <Box centered style={{ marginTop: wp(42), maxWidth: wp(310) }}>
                <Text.Medium aligned="center" color={colors.light} size={20}>
                  {t(tokens.report.assistance)}
                </Text.Medium>
                <Text.Regular
                  style={{ marginTop: wp(4), lineHeight: wp(20) }}
                  aligned="center"
                  color={colors.light}
                  size={16}
                >
                  {t(tokens.report.press)}
                </Text.Regular>
              </Box>
              <TouchableOpacity
                style={{
                  marginTop: wp(46),
                }}
                onPress={handleSendLead}
                disabled={isLoading}
              >
                <Box centered justified style={styles.overlay} full>
                  <Text.Regular color={colors.light} size={16}>
                    {t(tokens.report.emergency)}
                  </Text.Regular>
                  <Text.Bold color={colors.light} size={26}>
                    {t(tokens.report.here)}
                  </Text.Bold>
                  {direction === "ltr" && (
                    <Text.Regular color={colors.light} size={16}>
                      {t(tokens.report.record)}
                    </Text.Regular>
                  )}
                </Box>
                <ReportButtonEn width={wp(231)} height={wp(231)} />
              </TouchableOpacity>
              {isLoading && (
                <Box row centered reversed={direction === "rtl"}>
                  <LoaderKit
                    style={{ width: wp(42), height: wp(42) }}
                    name="BallScaleMultiple"
                    size={wp(42)}
                    color={colors.light}
                  />
                  <Text.Regular
                    color={colors.light}
                    style={{ marginLeft: wp(12) }}
                  >
                    {t(tokens.report.retrieving)}
                  </Text.Regular>
                </Box>
              )}
            </Box>
            {/* Floating action button for future use */}
            {/* <Box full end>
              <TouchableOpacity style={styles.fab}>
                <FontAwesomeIcon
                  color={colors.light}
                  size={wp(20)}
                  icon={["far", "plus"]}
                />
              </TouchableOpacity>
            </Box> */}
          </Box>
        </RootLayout>
      </DrawerLayout>
    </>
  );
};

export default Report;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      paddingVertical: wp(36),
    },
    fab: {
      width: wp(54),
      height: wp(54),
      borderColor: colors.light,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: wp(27),
    },
    overlay: {
      position: "absolute",
      height: wp(231),
      width: wp(231),
      zIndex: 10,
    },
  });
