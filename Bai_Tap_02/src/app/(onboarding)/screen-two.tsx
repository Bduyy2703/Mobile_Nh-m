import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import OnBoardingLayout from "~/components/layouts/OnBoardingLayout";
import Button from "~/components/Button";
import { router } from "expo-router";

const ScreenTwo = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <OnBoardingLayout>
          <View className="flex items-center justify-center h-full">
            <Text className="font-Poppins-SemiBold text-white">
              On Boarding Screen Two
            </Text>
            <Button
              label="Next"
              onPress={() => {
                router.push("/sign-in");
              }}
            />
          </View>
        </OnBoardingLayout>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScreenTwo;
