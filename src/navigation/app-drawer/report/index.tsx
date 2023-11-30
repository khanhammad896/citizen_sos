import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReportStackParamList } from "@utils/types";
import { SCREEN_OPTIONS } from "@utils/constants";
import Report from "@screens/app/app-drawer/report";
import Evidence from "@screens/app/app-drawer/report/evidence";
import LightBox from "@screens/app/app-drawer/report/light-box";

const ReportStack = createNativeStackNavigator<ReportStackParamList>();

export default function ReportScreens() {
  return (
    <ReportStack.Navigator
      initialRouteName="home"
      screenOptions={SCREEN_OPTIONS}
    >
      <ReportStack.Screen name="home" component={Report} />
      <ReportStack.Screen name="evidence" component={Evidence} />
      <ReportStack.Screen
        name="light-box"
        component={LightBox}
        options={{ presentation: "containedTransparentModal" }}
      />
    </ReportStack.Navigator>
  );
}
