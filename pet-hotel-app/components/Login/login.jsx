import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { commonStyles } from '../../style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PasswordInput } from '../PasswordInput/passwordInput';
import googleIcon from '../../assets/images/icons8-google-48.png';
import facebookIcon from '../../assets/images/icons8-facebook-48.png';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import ToggleFlag from '../ToggleButtonLanguage/ToggleButton';
import BASE from '../../config/AXIOS_BASE';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

const LoginScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t, i18n } = useTranslation();

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleForgot = () => {
    // router.push('/screen/forgotPassword'); 
  }

  const handleLogin = async () => {
    const loginPayload = {
      usernameOrEmail: usernameOrEmail,
      password: password,
    };

    try {
      const response = await BASE.post('/login', loginPayload);
      if (response.status === 200) {
        const token = response.data.access_token;
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        console.log('Login successful, token:', token);
        console.log('Login successful, userId:', userId);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', userId);

        router.push('/home');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Login failed:', errorMessage);

      // Alert for failed login attempt
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }

    // router.push('/home');
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };




  return (
    <SafeAreaView style={commonStyles.containerContent}>
      <StatusBar barStyle="dark-content" />
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Image
          source={require('./../../assets/images/logo.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </View>

      <Text style={commonStyles.titleText}>{t('welcome')}</Text>

      <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
        <ToggleFlag />
      </View>
      <TextInput
        style={commonStyles.input}
        placeholder={t('username')}
        keyboardType="email-address"
        placeholderTextColor={'#8BBCE5'}
        value={usernameOrEmail}
        onChangeText={setUsernameOrEmail}
      />
      <PasswordInput placeholder={t('password')} onPasswordChange={handlePasswordChange} />

      <TouchableOpacity onPress={() => navigation.navigate("screen/forgotPassword")}>
        <Text style={[commonStyles.subButton, { textAlign: 'right', marginRight: 10 }]}>{t('forgotPassword?')}</Text>
      </TouchableOpacity>

      <View style={commonStyles.mainButtonContainer}>
        <TouchableOpacity onPress={handleLogin} style={commonStyles.mainButton}>
          <Text style={commonStyles.textMainButton}>{t('login')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={commonStyles.orText}>________________________________________</Text>

      <View style={commonStyles.buttonContainer}>
        <TouchableOpacity style={commonStyles.googleButton} onPress={() => { }}>
          <Image source={googleIcon} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>

        {/* <TouchableOpacity style={commonStyles.facebookButton} onPress={() => {}}>
          <Image source={facebookIcon} style={{ width: 50, height: 50 }} />
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
