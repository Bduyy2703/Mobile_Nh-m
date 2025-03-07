import { View, Text, ScrollView } from "react-native";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <ScrollView className="bg-secondary">{children}</ScrollView>;
};

export default AuthLayout;
