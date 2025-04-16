import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/AXIOS_API';
import Header from '../../components/Header/header';
import { commonStyles } from '../../style';
import SuccessIcon from './../../assets/images/success.png';

const BookingSuccess = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert(t('error'), t('noToken'));
          router.push('/login');
          return;
        }

        const response = await API.get(`/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setBookingData(response.data);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        Alert.alert(t('error'), t('fetchBookingDetailsFailed'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    } else {
      Alert.alert(t('error'), t('noBookingId'));
      router.push('/home');
    }
  }, [id]);

  const handlePayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t('error'), t('noToken'));
        router.push('/login');
        return;
      }

      const response = await API.post(
        `/payment/create-paymentlink/booking/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            returnUrl: '/screen/success',
            cancelUrl: '/screen/cancel',
          },
        }
      );

      if (response.status === 200) {
        const { accountName, accountNumber, amount, bin, description, qrCode, orderCode, paymentLinkId } = response.data;
        router.push({
          pathname: '/screen/payment',
          params: {
            accountName,
            accountNumber,
            amount,
            bin,
            description,
            qrCode,
            orderCode,
            paymentLinkId,
          },
        });
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
      Alert.alert(t('error'), t('createPaymentLinkFailed'));
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t('bookingSuccess')} />
      <ScrollView style={commonStyles.containerContent}>
        <View style={styles.successContainer}>
          <View style={{ alignItems: 'center', margin: 20 }}>
            <Image source={SuccessIcon} style={styles.successIcon} />
          </View>
          <Text style={styles.text3}>{t('bookingSuccessMessage')}</Text>
          <Text style={styles.text4}>{t('thankYouMessage')}</Text>
        </View>
        <TouchableOpacity style={styles.view3} onPress={handlePayment}>
          <Text style={styles.text5}>{t('proceedToPayment')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={{ alignItems: 'center' }}>
          <Text style={styles.text6}>{t('goHome')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  successContainer: {
    marginTop: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
  },
  text3: {
    color: '#4EA0B7',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 13,
    fontFamily: 'nunito-bold',
    textAlign: 'center',
  },
  text4: {
    color: '#000000',
    fontSize: 16,
    marginBottom: 100,
    fontFamily: 'nunito-medium',
    textAlign: 'center',
  },
  text5: {
    color: '#FDFBF6',
    fontSize: 18,
    fontFamily: 'nunito-bold',
  },
  text6: {
    color: '#4EA0B7',
    fontSize: 18,
    marginBottom: 30,
    fontFamily: 'nunito-bold',
  },
  view3: {
    alignItems: 'center',
    backgroundColor: '#4EA0B7',
    borderRadius: 30,
    paddingVertical: 15,
    marginBottom: 34,
    marginHorizontal: 32,
  },
});

export default BookingSuccess;