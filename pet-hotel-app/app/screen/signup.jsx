import React from 'react';
import SignUpScreen from '../../components/Signup/signup';
import { commonStyles } from '../../style';
import Header from './../../components/Header/header'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';


export default function SignUp() {
  const { t, i18n } = useTranslation();
  return (
    <SafeAreaView style={commonStyles.containerContent}> 
    {/* <Header title={t('signup')}/> */}
    <SignUpScreen />
    </SafeAreaView>
  );
}

