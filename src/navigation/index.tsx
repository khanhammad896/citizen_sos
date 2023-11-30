import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "@screens/app/welcome";
import { AppStackParamList } from "@utils/types";
import { SCREEN_OPTIONS } from "@utils/constants";
import { useAuth } from "@hooks/use-auth";
import { AppDrawerScreens } from "./app-drawer";
import AuthScreens from "./auth";

const AppStack = createNativeStackNavigator<AppStackParamList>();

export default function Router() {
  const { isAuthenticated, isOnBoarded } = useAuth();
  return (
    <AppStack.Navigator
      initialRouteName={isAuthenticated ? "drawer" : "auth"}
      screenOptions={SCREEN_OPTIONS}
    >
      {isAuthenticated ? (
        <AppStack.Group>
          {!isOnBoarded && (
            <AppStack.Screen name="welcome" component={Welcome} />
          )}
          <AppStack.Screen name="drawer" component={AppDrawerScreens} />
        </AppStack.Group>
      ) : (
        <AppStack.Screen
          name="auth"
          component={AuthScreens}
          options={{
            animationTypeForReplace: isAuthenticated ? "push" : "pop",
          }}
        />
      )}
    </AppStack.Navigator>
  );
}
