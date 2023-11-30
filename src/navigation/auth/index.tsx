import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgetPassword from "@screens/app/auth/forget-password";
import Login from "@screens/app/auth/login";
import ResetPassword from "@screens/app/auth/reset-password";
import Reigster from "@screens/app/auth/register";
import Verification from "@screens/app/auth/verification";
import { AuthStackParamList } from "@utils/types";
import { SCREEN_OPTIONS } from "@utils/constants";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthScreens() {
  return (
    <AuthStack.Navigator
      initialRouteName="login"
      screenOptions={SCREEN_OPTIONS}
    >
      <AuthStack.Screen name="login" component={Login} />
      <AuthStack.Screen name="forget-password" component={ForgetPassword} />
      <AuthStack.Screen name="verification" component={Verification} />
      <AuthStack.Screen name="reset-password" component={ResetPassword} />
      <AuthStack.Screen
        name="register"
        component={Reigster}
        options={{
          animation: "slide_from_right",
        }}
      />
    </AuthStack.Navigator>
  );
}
