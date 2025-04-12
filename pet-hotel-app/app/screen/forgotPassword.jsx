import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import BASE from "../../config/AXIOS_BASE";
import { t } from "i18next";
import Header from "../../components/Header/header";
import { commonStyles } from "../../style";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(t("Error"), t("Please enter your email."));
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert(t("Error"), t("Please enter a valid email address."));
      return;
    }

    try {
      const response = await BASE.post(`/forgot-password?email=${email}`);
      if (response.status === 200) {
        console.log("Password reset email sent");
        Alert.alert(t("Success"), t("Password reset email sent"));
        router.push({
          pathname: "/screen/resetPassword",
          params: { email: email },
        });
      }
    } catch (error) {
      console.error("Password reset failed:", error.message);
      Alert.alert(t("Error"), t("Password reset failed. Please try again."));
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t("forgotPassword")} />
      <View style={commonStyles.containerContent}>
        {/* <View style={commonStyles.innerContainer}> */}
        <Text style={{color:'#416FAE', fontSize:17, textAlign:'center', margin:10}}>
          Vui lòng nhập email đăng kí tài khoản
        </Text>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={commonStyles.input}
          placeholderTextColor={'#8BBCE5'}
          value={email}
          onChangeText={setEmail}
        />
        <View style={commonStyles.mainButtonContainer}>
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={commonStyles.mainButton}
          >
            <Text style={commonStyles.textMainButton}>Reset Password</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
