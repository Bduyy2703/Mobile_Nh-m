import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonStyles } from "../../style";
import { PasswordInput } from "../PasswordInput/passwordInput";
import googleIcon from "../../assets/images/icons8-google-48.png";
import facebookIcon from "../../assets/images/icons8-facebook-48.png";
import { useTranslation } from "react-i18next";
import BASE from "../../config/AXIOS_BASE";

const SignUpScreen = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {

    if (!username || !fullName || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    // if (!validateEmail(email)) {
    //   Alert.alert("Validation Error", "Please enter a valid email address.");
    //   return;
    // }

    // if (!validatePhoneNumber(phone)) {
    //   Alert.alert("Validation Error", "Please enter a valid phone number.");
    //   return;
    // }

    // if (password.length < 6) {
    //   Alert.alert("Validation Error", "Password should be at least 6 characters long.");
    //   return;
    // }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match!");
      return;
    }


    const registerPayload = {
      username: username,
      fullName: fullName,
      email: email,
      phone: phone,
      dob: "1990-01-01",
      address: "123 Ho Chi Minh City",
      gender: "Male",
      password: password,
      confirmPassword: confirmPassword,
    };

    try {
      const response = await BASE.post("/register", registerPayload);
      if (response.status === 201) {
        Alert.alert("Signup Successful", "Please check your email for verification.");
        // Redirect to the verification screen
        router.push(`/screen/verify?email=${encodeURIComponent(email)}`);

      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Signup failed:", errorMessage);
      Alert.alert("Signup Failed", errorMessage);
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  return (
    <View style={commonStyles.containerContent}>
      <StatusBar barStyle="dark-content" />
      <View style={{ width: '100%', alignItems: 'center' }}>
      <Image
          source={require('./../../assets/images/logo.png')}
          style={{ width:150, height:150}}
          resizeMode="contain" 
        />
      </View>
      <Text style={commonStyles.titleText}>{t('welcome')}</Text>

      <TextInput
        style={commonStyles.input}
        placeholder="Username"
        placeholderTextColor={'#8BBCE5'}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={commonStyles.input}
        placeholder={t("name")}
        placeholderTextColor={'#8BBCE5'}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Email"
        placeholderTextColor={'#8BBCE5'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={commonStyles.input}
        placeholder={t("phoneNumber")}
        placeholderTextColor={'#8BBCE5'}
        keyboardType="numeric"
        value={phone}
        onChangeText={setPhone}
      />
      <PasswordInput
        placeholder={t("password")}
        onPasswordChange={handlePasswordChange}
      />
      <PasswordInput
        placeholder={t("confirmPassword")}
        onPasswordChange={handleConfirmPasswordChange}
      />
      <View style={commonStyles.mainButtonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={commonStyles.mainButton}>
          <Text style={commonStyles.textMainButton}>{t("createButton")}</Text>
        </TouchableOpacity>
      </View>
      <Text style={commonStyles.orText}>________________________________________</Text>
      <View style={commonStyles.buttonContainer}>
        <TouchableOpacity style={commonStyles.googleButton} onPress={() => {}}>
          <Image source={googleIcon} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={commonStyles.facebookButton} onPress={() => {}}>
          <Image source={facebookIcon} style={{ width: 50, height: 50 }} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default SignUpScreen;
