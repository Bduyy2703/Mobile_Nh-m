import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { jwtDecode } from "jwt-decode";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import googleIcon from '../../assets/images/icons8-google-48.png';
import BASE from '../../config/AXIOS_BASE';
import { database } from '../../config/firebase';
import { commonStyles } from '../../style';
import { PasswordInput } from '../PasswordInput/passwordInput';
import ToggleFlag from '../ToggleButtonLanguage/ToggleButton';
const LoginScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t, i18n } = useTranslation();

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleLogin = async () => {
    const loginPayload = {
      usernameOrEmail: usernameOrEmail,
      password: password,
    };
  
    try {
      const response = await BASE.post('/login', loginPayload);
      if (response.status === 200) {
        const token = response.data.access_token;
        const fullName = response.data.fullName;
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const isPremium = decodedToken.isPremium;
  
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('fullName', fullName);
        await AsyncStorage.setItem('isPremium', JSON.stringify(isPremium));
  
        try {
          const userDocRef = doc(database, 'users', userId);
          await setDoc(userDocRef, {
            _id: userId,
            name: fullName,
            avatar: 'https://i.pravatar.cc/300',
          });
        } catch (firestoreError) {
          console.error('Lỗi ghi dữ liệu Firestore:', firestoreError);
        }
  
        console.log('Chuyển hướng sang /home');
        router.push('/home');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Đăng nhập thất bại:', errorMessage);
      Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    }
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
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
