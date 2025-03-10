import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

const HomeScreen = () => {
  const { email } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <View className="flex items-center justify-center h-screen">
        <Text className="text-2xl font-bold">Home</Text>
        <Text className="text-lg mt-2">Welcome, {email}!</Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;