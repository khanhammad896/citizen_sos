import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { Box } from "@components/layout";
import { colors } from "@theme/index";
import { wp } from "@utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { PrimaryAvatar } from "@components/ui/avatars";
import { ReportScreenNavigationProps, User } from "@utils/types";
import { DrawerActions } from "@react-navigation/native";
import { useAuth } from "@hooks/use-auth";
import { useDrawerStatus } from "@react-navigation/drawer";

interface HeaderProps {
  navigation: ReportScreenNavigationProps<"home">;
}

const Header: FC<HeaderProps> = ({ navigation }) => {
  const styles = makeStyles();
  const { user }: { user: User } = useAuth();
  const isDrawerOpen = useDrawerStatus() === "open";

  return (
    <Box row between centered style={styles.root}>
      <Box>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <FontAwesomeIcon
            size={wp(22)}
            color={colors.light}
            icon={["fal", isDrawerOpen ? "xmark" : "bars-sort"]}
          />
        </TouchableOpacity>
      </Box>
      <Box>
        <Box row centered>
          {/* Notification button for future phase */}
          {/* <TouchableOpacity>
            <View style={styles.badge} />
            <FontAwesomeIcon
              size={wp(20)}
              color={colors.light}
              icon={["fal", "bell"]}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{ marginLeft: wp(30) }}
            onPress={() =>
              navigation.navigate("profile", { isEditable: false })
            }
          >
            <PrimaryAvatar
              name={`${user.first_name} ${user.last_name}`}
              bgcolor="transparent"
            />
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;

const makeStyles = () =>
  StyleSheet.create({
    root: {
      marginTop: Platform.select({ android: wp(24) }),
    },
    badge: {
      position: "absolute",
      top: wp(2),
      right: wp(2),
      backgroundColor: "red",
      width: wp(8),
      height: wp(8),
      borderRadius: wp(4),
      zIndex: 1,
    },
  });
