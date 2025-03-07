import { Stack, router } from "expo-router";
import { TouchableOpacity, Text, View } from "react-native";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
      <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
      <Stack.Screen name="otp-screen" options={{ title: "OTP Verification" }} />
    </Stack>
  );
};

export default AuthLayout;