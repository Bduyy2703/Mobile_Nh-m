import { View, Text, TextInput } from "react-native";
import React from "react";

type InputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
};

const Input = (props: InputProps) => {
  return (
    <View>
      <Text>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
      />
    </View>
  );
};

export default Input;
