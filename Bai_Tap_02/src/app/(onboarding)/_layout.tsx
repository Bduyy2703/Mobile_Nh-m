import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const OnBoardingLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="screen-one"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen-two"
          options={{
            headerShown: false,
          }}
        />

        <View>
          <Text>OnBoarding Layout</Text>
        </View>
      </Stack>
    </>
  );
};

export default OnBoardingLayout;
