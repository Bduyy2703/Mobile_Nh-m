import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { commonStyles } from '../../style';
import Header from '../../components/Header/header';

const CancelScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { orderCode } = useLocalSearchParams();

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t('cancelPayment')} />
      <View style={styles.container}>
        <Text style={styles.cancelMessage}>{t('paymentCancelled')}</Text>
        <Text style={styles.details}>
          {t('paymentCancelledMessage', { orderCode })}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/home')}
        >
          <Text style={styles.buttonText}>{t('goHome')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FDFBF6',
  },
  cancelMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
    fontFamily: 'nunito-bold',
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'nunito-medium',
  },
  button: {
    backgroundColor: '#4EA0B7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#FDFBF6',
    fontSize: 18,
    fontFamily: 'nunito-bold',
  },
});

export default CancelScreen;