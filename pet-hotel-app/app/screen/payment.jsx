import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import TransferInfo from '../../components/Payment/TransferInfo';
import Header from '../../components/Header/header';
import { commonStyles } from '../../style';

const Payment = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { accountName, accountNumber, amount, bin, description, qrCode, orderCode, paymentLinkId, type } = useLocalSearchParams();

  if (!orderCode || !qrCode) {
    router.push('/home');
    return null;
  }

  return (
    <PaperProvider>
      <SafeAreaView style={commonStyles.container}>
        <Header title={t('payment')} />
        <ScrollView style={commonStyles.containerContent}>
          <View style={styles.innerContainer}>
            <TransferInfo
              accountName={accountName}
              accountNumber={accountNumber}
              amount={amount}
              bin={bin}
              description={description}
              qrCode={qrCode}
              orderCode={orderCode}
              paymentLinkId={paymentLinkId}
              type={type}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    padding: 20,
    backgroundColor: '#FDFBF6',
    flex: 1,
  },
});

export default Payment;