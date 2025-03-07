import "../../global.css";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { persistStore } from "redux-persist";
import rtkStore from "~/infrastructure/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

const persistor = persistStore(rtkStore);

const RootLayout = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, error] = useFonts({
    "TenorSans-Regular": require("../../assets/fonts/TenorSans-Regular.ttf"),

    "Poppins-Black": require("../../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      setAppIsReady(true);

      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <Provider store={rtkStore}>
      <PersistGate
        loading={<Text>Loading persisted data... !!!!</Text>}
        persistor={persistor}
      >
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          ></Stack>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
