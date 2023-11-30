import { StyleSheet, View } from "react-native";
import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import { wp } from "@utils/helper";

const ListItemSkeleton = () => {
  const theme = useTheme();
  const { colors, direction } = theme;
  const styles = makeStyles(theme);
  return (
    <View
      style={[
        styles.root,
        { ...(direction === "rtl" && { alignItems: "flex-end" }) },
      ]}
    >
      <SkeletonPlaceholder borderRadius={wp(16)} backgroundColor={colors.zinc}>
        <>
          <SkeletonPlaceholder.Item
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <SkeletonPlaceholder.Item width={wp(57)} height={wp(14)} />

            <SkeletonPlaceholder.Item
              width={wp(92)}
              height={wp(13)}
              marginLeft={wp(9)}
            />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: wp(7),
            }}
          >
            <SkeletonPlaceholder.Item
              width={wp(166)}
              height={wp(14)}
              marginTop={wp(7)}
            />
          </SkeletonPlaceholder.Item>
        </>
      </SkeletonPlaceholder>
    </View>
  );
};

export const ListSkeleton = () => {
  return Array.from([1, 2, 3, 4, 5], (item) => <ListItemSkeleton key={item} />);
};

export default ListSkeleton;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      backgroundColor: colors.light,
      borderColor: colors.zinc,
      marginTop: wp(12),
      borderRadius: wp(16),
      paddingHorizontal: wp(18),
      paddingVertical: wp(12),
      borderWidth: 1,
      width: "100%",
      height: wp(69),
    },
  });
