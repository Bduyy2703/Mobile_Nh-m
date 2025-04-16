import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Header from '../../components/Header/header';
import { commonStyles } from '../../style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/AXIOS_API';

const Schedule = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState(1); // 1: PENDING, 2: SUCCESS
  const [userId, setUserId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const pageSize = 10;
  const sortBy = 'dateBooking';
  const sortDir = 'desc';

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      if (!storedUserId || !token) {
        Alert.alert(t('error'), t('notLoggedIn'));
        router.push('/login');
        return;
      }
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);

  const fetchData = async (newPage = 0, reset = false) => {
    if (!userId || loading) return;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = status === 1
        ? `bookings/pending/users/${userId}`
        : `bookings/completed/users/${userId}`;

      const response = await API.get(`${endpoint}?pageNo=${newPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const newBookings = response.data.content;
        setBookings(prevBookings => reset ? newBookings : [...prevBookings, ...newBookings]);
        setHasMore(newBookings.length === pageSize);
        setPage(newPage);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert(t('error'), t('fetchBookingsFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData(0, true);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      setBookings([]);
      fetchData(0, true);
    }
  }, [status]);

  const loadMoreData = () => {
    if (!loading && hasMore) {
      fetchData(page + 1);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    setHasMore(true);
    await fetchData(0, true);
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/screen/booking/${item.id}`)}
    >
      <Image
        source={{ uri: item.shopImage || 'https://i.imgur.com/1tMFzp8.png' }}
        resizeMode={'stretch'}
        style={styles.image}
      />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'nunito-bold' }}>{item.shopName}</Text>
        <Text style={styles.textItem}>
          {t('use')}: {item.type === '1' ? t('room') : item.type === '2' ? t('service') : t('roomAndService')}
        </Text>
        <Text style={styles.textItem}>
          {t('bookedOn')}: {new Date(item.dateBooking).toLocaleString()}
        </Text>
        <Text style={styles.textItem}>
          {t('totalPrice')}: {item.totalPrice} VNĐ
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t('trackSchedule')} />
      <View style={styles.statusBar}>
        <TouchableOpacity
          onPress={() => setStatus(1)}
          style={[styles.statusBtn, { backgroundColor: status === 1 ? '#555' : '#fff' }]}
        >
          <Text style={{ color: status === 1 ? '#fff' : '#000' }}>{t('pending')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStatus(2)}
          style={[styles.statusBtn, { backgroundColor: status === 2 ? '#555' : '#fff' }]}
        >
          <Text style={{ color: status === 2 ? '#fff' : '#000' }}>{t('success')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#4EA0B7" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('noBookings')}</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statusBtn: {
    padding: 10,
    borderRadius: 10,
  },
  item: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#F0F6FD',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    borderRadius: 12,
    width: 100,
    height: 100,
    marginRight: 12,
  },
  textItem: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'nunito-medium',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    fontFamily: 'nunito-medium',
  },
});

export default Schedule;