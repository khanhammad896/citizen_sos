import { StyleSheet, View } from "react-native";
import React, { FC } from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { useTheme } from "@hooks/use-theme";
import TitleDark from "@assets/media/title-dark.svg";
import { wp } from "@utils/helper";
import { Box } from "@components/layout";
import { TouchableOpacity } from "react-native-gesture-handler";
import LanguageSwitch from "@components/language-switch";
import { tokens } from "@locales/tokens";
import { useUi } from "@hooks/use-ui";
import { PrimaryButton } from "@components/ui/buttons";
import { useAuth } from "@hooks/use-auth";
import { Text } from "./ui/typography";

const CustomDrawer: FC<DrawerContentComponentProps> = ({ ...props }) => {
  const { navigation } = props;
  const theme = useTheme();
  const styles = makeStyles();
  const { colors, direction } = theme;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { language } = useUi();
  const { signOut, user } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <View style={[styles.root, { marginTop: insets.top }]}>
      <TitleDark width={wp(166)} height={wp(34)} />
      <Box
        end={direction === "rtl"}
        style={{ marginTop: wp(40), marginBottom: wp(24) }}
      >
        <Text.Medium size={20} style={{ textTransform: "capitalize" }}>
          {t(tokens.nav.greet)}
          {user?.first_name}
        </Text.Medium>
        <TouchableOpacity
          onPress={() => navigation.navigate("profile", { isEditable: true })}
        >
          <Text.Regular color={colors.secondary}>
            {t(tokens.nav.edit)}
          </Text.Regular>
        </TouchableOpacity>
      </Box>
      <LanguageSwitch color={colors.success} />
      <DrawerContentScrollView>
        <DrawerItemList key={`${language}-${direction}`} {...props} />
      </DrawerContentScrollView>
      <PrimaryButton
        onPress={handleSignOut}
        radius={10}
        bgcolor={colors.danger}
        startAdornment={() => (
          <FontAwesomeIcon
            icon={["far", "arrow-right-from-bracket"]}
            color={colors.light}
            size={wp(16)}
            transform={{
              rotate: 180,
            }}
          />
        )}
      >
        {t(tokens.nav.signout)}
      </PrimaryButton>
    </View>
  );
};

export default CustomDrawer;

const makeStyles = () =>
  StyleSheet.create({
    root: {
      flex: 1,
      paddingHorizontal: wp(32),
      paddingVertical: wp(41),
    },
  });
