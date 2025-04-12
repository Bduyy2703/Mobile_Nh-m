import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const [loaded] = useFonts({
    "open-sans": require("./../assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./../assets/fonts/OpenSans-Bold.ttf"),
    "open-sans-medium": require("./../assets/fonts/OpenSans-Medium.ttf"),
    nunito: require("./../assets/fonts/Nunito-Regular.ttf"),
    "nunito-bold": require("./../assets/fonts/Nunito-Bold.ttf"),
    "nunito-medium": require("./../assets/fonts/Nunito-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
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
        <Stack.Screen name="index" />
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
      </Stack>
      
    </ClerkProvider>
  );
}
