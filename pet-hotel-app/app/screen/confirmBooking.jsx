import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Text, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/AXIOS_API';
import moment from 'moment';
import Header from '../../components/Header/header';
import { commonStyles } from '../../style';

const ConfirmBooking = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [shop, setShop] = useState(null);
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [days, setDays] = useState(0);
  const [tax, setTax] = useState(0.1);
  const [discount, setDiscount] = useState(0);

  const selectedServiceNames = services
    .filter((service) => bookingData?.serviceIds?.includes(service.id))
    .map((service) => service.name);

  const selectedServicePrices = Array.from(
    new Set(
      services
        .filter((service) => bookingData?.serviceIds?.includes(service.id))
        .map((service) => service.id)
    )
  ).map((id) => {
    const service = services.find((s) => s.id === id);
    return service.price;
  });

  const totalServicePrice = selectedServicePrices.reduce((acc, price) => acc + price, 0) || 0;

  useEffect(() => {
    const fetchPremium = async () => {
      try {
        const premium = await AsyncStorage.getItem('isPremium');
        const isPremiumUser = premium === 'true';
        setIsPremium(isPremiumUser);
        setTax(isPremiumUser ? 0.05 : 0.1);
        setDiscount(isPremiumUser ? 0.1 : 0);
      } catch (error) {
        console.error('Error fetching premium status:', error);
        Alert.alert(t('error'), t('fetchPremiumFailed'));
      }
    };
    fetchPremium();
  }, []);

  const fetchBookingData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('booking');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setBookingData(parsedData);
        const startDate = moment(parsedData.startDate);
        const endDate = parsedData.endDate ? moment(parsedData.endDate) : null;
        if (endDate && endDate.isValid()) {
          const dayDiff = endDate.diff(startDate, 'days');
          setDays(dayDiff > 0 ? dayDiff : 1); // Đảm bảo ít nhất 1 ngày
        } else {
          setDays(1); // Mặc định 1 ngày nếu không có endDate
        }
      } else {
        Alert.alert(t('error'), t('noBookingData'));
        router.back();
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
      Alert.alert(t('error'), t('fetchBookingDataFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomDetails = async () => {
    if (!bookingData?.roomId) return;
    try {
      const response = await API.get(`/rooms/${bookingData.roomId}`);
      if (response.status === 200) {
        setRoom(response.data);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      Alert.alert(t('error'), t('fetchRoomDetailsFailed'));
    }
  };

  const fetchServices = async () => {
    try {
      const response = await API.get(`/services/shops/${id}`);
      if (response.status === 200) {
        setServices(response.data.content);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert(t('error'), t('fetchServicesFailed'));
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (bookingData) {
        await Promise.all([fetchServices(), fetchRoomDetails()]);
      }
    };
    fetchData();
  }, [bookingData]);

  const handleBooking = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t('error'), t('noToken'));
        return;
      }

      const body = {
        startDate: bookingData.startDate,
        endDate: bookingData.endDate || null,
        note: bookingData.note || '',
        roomId: bookingData.roomId,
        petId: bookingData.petId,
        userId: bookingData.userId,
        serviceIds: bookingData.serviceIds || [],
      };

      const response = await API.post('/bookings', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        await AsyncStorage.removeItem('booking');
        router.push({
          pathname: '/screen/bookingSuccess',
          params: { id: response.data.id },
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert(t('error'), t('confirmBookingFailed'));
    }
  };

  const basePrice = room?.price ? room.price * days : 0;
  const subtotal = basePrice + totalServicePrice;
  const taxAmount = subtotal * tax;
  const discountAmount = subtotal * discount;
  const totalPrice = subtotal + taxAmount - discountAmount;

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t('confirmBooking')} />
      <ScrollView style={commonStyles.containerContent}>
        <View style={styles.shopSection}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ImageBackground
              source={{ uri: shop?.image || 'https://via.placeholder.com/127x108' }}
              resizeMode="stretch"
              imageStyle={styles.view3}
              style={styles.view2}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.text4}>{shop?.name || 'KATYB PET CARE'}</Text>
            <View style={styles.row4}>
              <Image
                source={{ uri: 'https://via.placeholder.com/11x16' }}
                resizeMode="stretch"
                style={styles.image6}
              />
              <Text style={styles.text5}>{shop?.location || 'Quận 9'}</Text>
            </View>
            <Text style={styles.text6}>{room?.price ? `${room.price} VND/Ngày` : '150.000 VND/Ngày'}</Text>
          </View>
        </View>
        <View style={styles.row5}>
          <Text style={styles.text8}>{t('bookingDate')}</Text>
          <Text style={styles.text9}>
            {loading ? t('loading') : bookingData?.dateBooking || t('noBookingData')}
          </Text>
        </View>
        <View style={styles.row6}>
          <Text style={styles.text8}>{t('startDate')}</Text>
          <Text style={styles.text9}>
            {loading ? t('loading') : bookingData?.startDate || t('noBookingData')}
          </Text>
        </View>
        <View style={styles.row5}>
          <Text style={styles.text8}>{t('endDate')}</Text>
          <Text style={styles.text9}>
            {loading ? t('loading') : bookingData?.endDate || t('notSelected')}
          </Text>
        </View>
        <View style={styles.row7}>
          <Text style={styles.text8}>{t('additionalServices')}</Text>
          {selectedServiceNames.length === 0 ? (
            <Text style={styles.text9}>{t('none')}</Text>
          ) : (
            <View>
              {selectedServiceNames.map((name, index) => (
                <Text key={index} style={styles.text9}>{name}</Text>
              ))}
            </View>
          )}
        </View>
        <View style={styles.box3} />
        <View style={styles.row8}>
          <Text style={styles.text8}>{t('subtotal')}</Text>
          <Text style={styles.text9}>
            {loading ? t('loading') : `${subtotal} VND`}
          </Text>
        </View>
        <View style={styles.row9}>
          <Text style={styles.text8}>{t('serviceFee')}</Text>
          <Text style={styles.text9}>
            {loading ? t('loading') : `${taxAmount} VND (${tax * 100}%)`}
          </Text>
        </View>
        {isPremium && (
          <View style={styles.row9}>
            <Text style={styles.text8}>{t('premiumDiscount')}</Text>
            <Text style={styles.text9}>
              {loading ? t('loading') : `-${discountAmount} VND (${discount * 100}%)`}
            </Text>
          </View>
        )}
        <View style={styles.row10}>
          <Text style={styles.text8}>{t('totalPrice')}</Text>
          <Text style={styles.text9}>
            {loading ? t('loading') : `${totalPrice} VND`}
          </Text>
        </View>
        <View style={styles.box4} />
        <View style={styles.row11}>
          <Image
            source={{ uri: 'https://static-00.iconduck.com/assets.00/qr-scan-icon-512x512-9bsp061y.png' }}
            resizeMode="stretch"
            style={styles.image7}
          />
          <Text style={styles.text8}>{t('qrCode')}</Text>
          <View style={styles.box5} />
          <TouchableOpacity>
            <Text style={styles.text7}>{t('change')}</Text>
          </TouchableOpacity>
        </View>
        <View style={commonStyles.mainButtonContainer}>
          <TouchableOpacity onPress={handleBooking} style={commonStyles.mainButton}>
            <Text style={commonStyles.textMainButton}>{t('bookNow')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shopSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 30,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  view2: {
    width: 127,
    height: 108,
    marginRight: 17,
  },
  view3: {
    borderRadius: 15,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  row4: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  row5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
    marginHorizontal: 40,
  },
  row6: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginHorizontal: 40,
  },
  row7: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginHorizontal: 39,
  },
  row8: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 39,
  },
  row9: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 19,
    marginHorizontal: 39,
  },
  row10: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 23,
    marginHorizontal: 38,
  },
  row11: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    marginHorizontal: 45,
  },
  text4: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 7,
    marginLeft: 1,
  },
  text5: {
    color: '#AEACAC',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  text6: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  text7: {
    color: '#4EA0B7',
    fontSize: 12,
    fontWeight: 'bold',
  },
  text8: {
    color: '#999999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text9: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  image6: {
    width: 11,
    height: 16,
    marginRight: 8,
  },
  image7: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  box3: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 25,
    marginHorizontal: 33,
  },
  box4: {
    width: 318,
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 27,
    marginHorizontal: 31,
  },
  box5: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

export default ConfirmBooking;