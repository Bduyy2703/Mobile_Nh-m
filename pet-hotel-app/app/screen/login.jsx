import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import LoginScreen from '../../components/Login/login';

export default function Login() {
  return (
      <LoginScreen />
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
