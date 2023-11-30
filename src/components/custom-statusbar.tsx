import { FC } from "react";
import { StatusBar, StatusBarProps } from "react-native";
import { useDrawerStatus } from "@react-navigation/drawer";

const FocusAwareStatusBar: FC<StatusBarProps> = ({ ...props }) => {
  const isDrawerOpen = useDrawerStatus() === "open";
  return (
    <StatusBar
      barStyle={isDrawerOpen ? "dark-content" : "light-content"}
      {...props}
    />
  );
};

export default FocusAwareStatusBar;
