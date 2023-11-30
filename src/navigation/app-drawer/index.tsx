import CustomDrawer from "@components/custom-drawer";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@hooks/use-theme";
import { tokens } from "@locales/tokens";
import { createDrawerNavigator } from "@react-navigation/drawer";
import History from "@screens/app/app-drawer/history";
import Profile from "@screens/app/app-drawer/profile";
import { wp } from "@utils/helper";
import type { AppDrawerParamList } from "@utils/types";
import { SCREEN_OPTIONS } from "@utils/constants";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import ReportScreens from "./report";

const AppDrawer = createDrawerNavigator<AppDrawerParamList>();

export function AppDrawerScreens() {
  const { colors, fonts } = useTheme();
  const { t } = useTranslation();
  return (
    <AppDrawer.Navigator
      initialRouteName="report"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        ...SCREEN_OPTIONS,
        drawerType: "slide",
        overlayColor: "transparent",
        drawerHideStatusBarOnOpen: Platform.OS === "ios",
        drawerStyle: {
          backgroundColor: colors.background,
          width: "82%",
        },
        drawerActiveTintColor: colors.fade,
        drawerActiveBackgroundColor: "transparent",
        drawerItemStyle: {
          borderColor: colors.zinc,
          borderBottomWidth: 1,
        },
        drawerLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: wp(16),
          color: colors.fade,
        },
        sceneContainerStyle: { backgroundColor: colors.background },
      }}
    >
      <AppDrawer.Screen
        name="report"
        options={{
          title: t(tokens.nav.report),
          drawerIcon: () => (
            <FontAwesomeIcon
              color={colors.off}
              size={wp(20)}
              icon={["fal", "file"]}
            />
          ),
        }}
        component={ReportScreens}
      />
      <AppDrawer.Screen
        name="history"
        options={{
          title: t(tokens.nav.history),
          drawerIcon: () => (
            <FontAwesomeIcon
              color={colors.off}
              size={wp(20)}
              icon={["fal", "history"]}
            />
          ),
        }}
        component={History}
      />

      <AppDrawer.Screen
        name="profile"
        options={{
          title: t(tokens.nav.profile),
          drawerIcon: () => (
            <FontAwesomeIcon
              color={colors.off}
              size={wp(20)}
              icon={["fal", "user"]}
            />
          ),
          unmountOnBlur: true,
        }}
        component={Profile}
      />
    </AppDrawer.Navigator>
  );
}
