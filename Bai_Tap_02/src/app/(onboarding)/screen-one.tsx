import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import OnBoardingLayout from "~/components/layouts/OnBoardingLayout";
import Button from "~/components/Button";
import { router } from "expo-router";

const ScreenOne = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <OnBoardingLayout>
          <View className="flex items-center justify-center h-full">
            <Text className="font-Poppins-SemiBold text-white">
              On Boarding Screen One
            </Text>
            <Button
              label="Next"
              onPress={() => {
                router.push("screen-two");
              }}
            />
          </View>
        </OnBoardingLayout>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScreenOne;
