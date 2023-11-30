import {
  DrawerNavigationProp,
  DrawerScreenProps,
} from "@react-navigation/drawer";
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type AppStackParamList = {
  welcome: undefined;
  auth: NavigatorScreenParams<AuthStackParamList>;
  drawer: NavigatorScreenParams<AppDrawerParamList>;
};

export type AuthStackParamList = {
  login: undefined;
  register: undefined;
  "forget-password": undefined;
  verification: {
    user_id: number;
    contact_number: string;
  };
  "reset-password": { contact_number: string };
};

export type AppDrawerParamList = {
  report: NavigatorScreenParams<ReportStackParamList>;
  history: undefined;
  profile: { isEditable?: boolean };
};

export type ReportStackParamList = {
  home: undefined;
  evidence: { lead_id: number };
  "light-box": { type: "image/jpeg" | "video/mp4"; uri: string };
};

// ==================== SCREEN PROPS ======================

export type AppScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    NativeStackScreenProps<AppStackParamList>
  >;

export type AppDrawerScreenProps<T extends keyof AppDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<AppDrawerParamList, T>,
    NativeStackScreenProps<AppStackParamList>
  >;

export type ReportScreenProps<T extends keyof ReportStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      NativeStackScreenProps<ReportStackParamList, T>,
      DrawerScreenProps<AppDrawerParamList>
    >,
    NativeStackScreenProps<AppStackParamList>
  >;

// ================== NAVIGATION PROPS =====================

export type DrawerScreenNavigationProp<T extends keyof AppDrawerParamList> =
  CompositeNavigationProp<
    DrawerNavigationProp<AppDrawerParamList, T>,
    NativeStackNavigationProp<AppStackParamList>
  >;

export type ReportScreenNavigationProps<T extends keyof ReportStackParamList> =
  CompositeNavigationProp<
    CompositeNavigationProp<
      NativeStackNavigationProp<ReportStackParamList, T>,
      DrawerNavigationProp<AppDrawerParamList>
    >,
    NativeStackNavigationProp<AppStackParamList>
  >;
