import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";

type ButtonProps = {
  label: string;
  onPress?: () => void;
};

const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      className="flex items-center justify-center px-2 py-1 bg-slate-500 rounded-lg mt-5"
      onPress={props.onPress}
    >
      <Text className="text-white text-lg font-Poppins-Medium">
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({});
