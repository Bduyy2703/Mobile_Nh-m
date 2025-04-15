import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { commonStyles } from "../../style";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./../../components/Header/header";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import BASE from "../../config/AXIOS_BASE";

const VerifyScreen = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const { email } = useLocalSearchParams();
  const [code, setCode] = useState(["", "", "", ""]);

  const handleInputChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    console.log("Verification code:", verificationCode);

    console.log("Email:", email);
    console.log("Verification Code:", verificationCode);

    if (verificationCode.length !== 4) {
      console.error("Invalid verification code:", verificationCode);
      Alert.alert(t("Error"), t("Please enter a valid 4-digit code."));
      return;
    }

    try {
      const response = await BASE.post(
        `/verify-code?email=${encodeURIComponent(
          email
        )}&code=${encodeURIComponent(verificationCode)}`
      );
      if (response.status === 200) {
        console.log("Verification successful");
        Alert.alert(t("Success"), t("Verification successful!"));
        // router.push("/screen/init_profile");
        // router.push('/home');
        router.push('screen/login');
      }
    } catch (error) {
      console.error("Verification failed:", error.message);
      Alert.alert(t("Error"), t("Verification failed. Please try again."));
    }
  };

  const handleResend = async () => {
    try {
      const response = await BASE.post(`/resend-code?email=${email}`);
      if (response.status === 200) {
        console.log("Resend successful");
        Alert.alert(t("Success"), t("Verification code sent again!"));
      }
    } catch (error) {
      console.error("Resend failed:", error.message);
      Alert.alert(t("Error"), t("Resend failed. Please try again."));
    }
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t("verify")} />
      <View style={commonStyles.containerContent}>
        <Text style={commonStyles.subButton}>{t("verifySubText")}</Text>
        <Text style={commonStyles.subButton}>{email}</Text>

        <View style={styles.inputCode}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.input}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(value) => handleInputChange(index, value)}
            />
          ))}
        </View>

        <TouchableOpacity>
          <Text onPress={handleResend} style={commonStyles.subButton}>{t("verifyAgain")}</Text>
        </TouchableOpacity>
        <View style={commonStyles.mainButtonContainer}>
          <TouchableOpacity
            onPress={handleVerify}
            style={commonStyles.mainButton}
          >
            <Text style={commonStyles.textMainButton}>{t("verify")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputCode: {
    marginTop: 30,
    flexDirection: "row",
    gap: 30,
    justifyContent: "center",
    // height: 50,
  },

  input: {
    height: 70,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 30,
    flex: 1,
    textAlign: "center",
  },
});

export default VerifyScreen;
