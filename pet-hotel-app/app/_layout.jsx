import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "open-sans": require("./../assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./../assets/fonts/OpenSans-Bold.ttf"),
    "open-sans-medium": require("./../assets/fonts/OpenSans-Medium.ttf"),
    nunito: require("./../assets/fonts/Nunito-Regular.ttf"),
    "nunito-bold": require("./../assets/fonts/Nunito-Bold.ttf"),
    "nunito-medium": require("./../assets/fonts/Nunito-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "nunito-bold",
          color: "#4EA0B7",
          fontSize: 28,
        },
        headerStyle: {
          backgroundColor: "#FDFBF6",
        },
      }}
    >
      <Stack.Screen name="index"
        options={{
          headerShown: false,
        }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="search/SearchResult"
        options={{
          title: "Search Results",
        }}
      />
      <Stack.Screen
        name="screen/login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/signup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/verify"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/init_profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/changePassword"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/forgotPassword"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/resetPassword"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/message"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/newMessage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/group"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/chat"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/notifications"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/profileChat"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/evaluate"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/createEvaluate"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/confirmBooking"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/booking"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/details"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/bookingSuccess"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/pet"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/search"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/success"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/cancel"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/payment"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/resultScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/premium"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/schedule"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/update_pet"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screen/chatMessage"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
