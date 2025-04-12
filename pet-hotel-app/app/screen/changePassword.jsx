import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { commonStyles } from '../../style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { PasswordInput } from '../../components/PasswordInput/passwordInput';
import Header from '../../components/Header/header'
import BASE from '../../config/AXIOS_BASE';

const ChangePasswordScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { email } = useLocalSearchParams();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  const handleUpdate = async () => {
    // Validate fields
    if (!token || !password || !confirmPassword) {
      Alert.alert(t("Error"), t("Please fill in all fields."));
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      Alert.alert(t("Error"), t("Passwords do not match."));
      return;
    }

    const newPasswordRequest = {
      email: email,
      newPassword: password,
      token: token,
    }

    try {
      const response = await BASE.post(`/reset-password`, newPasswordRequest);
      if (response.status === 200) {
        console.log("Password updated successfully");
        Alert.alert(t("Success"), t("Password updated successfully!"));
        router.push("screen/login");
      }
    } catch (error) {
      console.error("Password update failed:", error.message);
      Alert.alert(t("Error"), t("Password update failed. Please try again."));
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t('changePassword')} />
      <View style={commonStyles.containerContent}>
      <Text style={[styles.header, { paddingTop: 20 }]}>
          {email}
        </Text>
        <Text style={[styles.header]}>
          {t('currentPassword')}
        </Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Current Password"
        />
        <Text style={styles.header}>
          {t('newPassword')}
        </Text>
        <PasswordInput placeholder={"Password"} onPasswordChange={handlePasswordChange} />
        <Text style={styles.header}>
          {t('confirmNewPassword')}
        </Text>
        <PasswordInput placeholder={"Password"} onPasswordChange={handleConfirmPasswordChange} />

        <View style={commonStyles.mainButtonContainer}>
          <TouchableOpacity onPress={handleUpdate} style={commonStyles.mainButton}>
            <Text style={commonStyles.textMainButton}>{t('update')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: 'nunito-medium',
    color: '#4EA0B7',
    fontSize: 17,
    paddingBottom: 5
  },
});

export default ChangePasswordScreen;
