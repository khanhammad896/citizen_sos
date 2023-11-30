/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Router from "@navigation/index";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MMKV } from "react-native-mmkv";
import { initializeMMKVFlipper } from "react-native-mmkv-flipper-plugin";
import { enableFreeze } from "react-native-screens";
import Toast, { ToastConfig } from "react-native-toast-message";

import { useFontAwesome } from "@hooks/use-fontawesome";
import { UiProvider } from "@contexts/ui";
import { AuthProvider } from "@contexts/auth";
import { ThemeProvider } from "@contexts/theme";
import "./src/locales/i18n";
import { ErrorToast, SuccessToast } from "@components/ui/feedbacks";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
    },
  },
});

export const storage = new MMKV();

if (__DEV__) {
  import("react-query-native-devtools").then(({ addPlugin }) => {
    addPlugin({ queryClient });
  });
  initializeMMKVFlipper({ default: storage });
}

enableFreeze(true);

const toastConfig: ToastConfig = {
  success: (props) => <SuccessToast {...props} />,
  error: (props) => <ErrorToast {...props} />,
};

function App(): JSX.Element {
  useFontAwesome();
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View style={[styles.root]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ThemeProvider>
        <AuthProvider>
          <UiProvider>
            <QueryClientProvider client={queryClient}>
              <NavigationContainer>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <BottomSheetModalProvider>
                    <Router />
                  </BottomSheetModalProvider>
                  <Toast config={toastConfig} />
                </GestureHandlerRootView>
              </NavigationContainer>
            </QueryClientProvider>
          </UiProvider>
        </AuthProvider>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    color: "white",
  },
});

export default App;
