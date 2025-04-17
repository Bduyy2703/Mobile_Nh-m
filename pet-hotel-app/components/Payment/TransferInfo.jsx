import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import TransferInfoField from './TransferInfoField';
import API from '../../config/AXIOS_API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransferInfo = ({
  accountName,
  accountNumber,
  amount,
  bin,
  description,
  qrCode,
  orderCode,
  paymentLinkId,
  type,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    let intervalId;

    const fetchStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert(t('error'), t('noToken'));
          router.push('/login');
          return;
        }

        const response = await API.get(`/payment/${orderCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const statusData = response.data.data;
        let updateStatus;

        if (statusData.status === 'PAID') {
          clearInterval(intervalId);
          updateStatus = 'SUCCESS';
          await handleUpdatePayment(updateStatus);
          if (type) {
            await AsyncStorage.setItem('isPremium', JSON.stringify(true));
          }
          router.push({
            pathname: '/screen/success',
            params: { orderCode },
          });
        } else if (statusData.status === 'CANCELLED') {
          clearInterval(intervalId);
          updateStatus = 'CANCELLED';
          await handleUpdatePayment(updateStatus);
          router.push({
            pathname: '/screen/cancel',
            params: { orderCode },
          });
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
        Alert.alert(t('error'), t('fetchPaymentStatusFailed'));
      }
    };

    intervalId = setInterval(fetchStatus, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderCode]);

  const cancelOrderHandle = async () => {
    Alert.alert(
      t('cancelPayment'),
      t('confirmCancelPayment'),
      [
        { text: t('cancel'), onPress: () => {} },
        { text: t('confirm'), onPress: () => handleCancel() },
      ],
      { cancelable: false }
    );
  };

  const handleCancel = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t('error'), t('noToken'));
        router.push('/login');
        return;
      }

      const response = await API.put(`/payment/${orderCode}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        router.push({
          pathname: '/screen/cancel',
          params: { orderCode },
        });
      }
    } catch (error) {
      console.error('Error while canceling order:', error);
      Alert.alert(t('error'), t('cancelPaymentFailed'));
    }
  };

  const handleUpdatePayment = async (status) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t('error'), t('noToken'));
        return;
      }

      const response = await API.put(`/payment/status/${orderCode}?status=${status}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error while updating payment:', error);
      Alert.alert(t('error'), t('updatePaymentStatusFailed'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TransferInfoField label={t('accountHolder')} text={accountName} />
        <TransferInfoField label={t('accountNumber')} text={accountNumber} />
        <TransferInfoField label={t('transferAmount')} text={amount} />
        <TransferInfoField label={t('transferDescription')} text={description} />
        <Text style={styles.instructionText}>{t('scanQRInstruction')}</Text>
        <View style={styles.qrCode}>
          <QRCode value={qrCode} size={200} backgroundColor="transparent" />
        </View>
        <Text style={styles.noteText}>
          {t('note')}: <Text style={{ fontWeight: 'bold' }}>{t('enterDescription', { description })}</Text>
        </Text>
        <Button
          mode="contained"
          style={styles.button}
          onPress={cancelOrderHandle}
        >
          {t('cancelPayment')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'grey',
    borderWidth: 0.2,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  innerContainer: {
    padding: 20,
    gap: 10,
  },
  qrCode: {
    overflow: 'hidden',
    width: 220,
    height: 220,
    padding: 10,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#E2D5FB',
  },
  button: {
    width: 150,
    alignSelf: 'center',
    backgroundColor: '#FF4D4F',
  },
  instructionText: {
    textAlign: 'center',
    color: 'grey',
    marginTop: 10,
  },
  noteText: {
    textAlign: 'center',
    marginTop: 10,
  },
});

export default TransferInfo;