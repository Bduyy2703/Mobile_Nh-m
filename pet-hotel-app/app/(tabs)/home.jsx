import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import API from '../../config/AXIOS_API';
import Header from '../../components/Home/Header';
import SubHeader from '../../components/Home/SubHeader';
import { commonStyles } from '../../style';

const Home = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [careServices, setCareServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageShops, setPageShops] = useState(0);
  const [pageCareServices, setPageCareServices] = useState(0);
  const [hasMoreShops, setHasMoreShops] = useState(true);
  const [hasMoreCareServices, setHasMoreCareServices] = useState(true);

  const pageSize = 10;
  const sortBy = 'id';
  const sortDir = 'asc';

  const fetchShops = async (newPage = 0, reset = false) => {
    if (loading || !hasMoreShops) return;
    setLoading(true);

    try {
      const response = await API.get(`/shops?pageNo=${newPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
      if (response.status === 200) {
        const newShops = response.data.content;
        console.log('Fetched Shops:', newShops); // Log để kiểm tra dữ liệu
        setShops(prevShops => reset ? newShops : [...prevShops, ...newShops]);
        setHasMoreShops(newShops.length === pageSize);
        setPageShops(newPage);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      Alert.alert(t('error'), t('fetchShopsFailed')); // Thông báo lỗi cho người dùng
    } finally {
      setLoading(false);
    }
  };

  const fetchCareServices = async (newPage = 0, reset = false) => {
    if (loading || !hasMoreCareServices) return;
    setLoading(true);

    try {
      const response = await API.get(`/services?pageNo=${newPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
      if (response.status === 200) {
        const newCareServices = response.data.content;
        console.log('Fetched Care Services:', newCareServices); // Log để kiểm tra dữ liệu
        setCareServices(prevServices => reset ? newCareServices : [...prevServices, ...newCareServices]);
        setHasMoreCareServices(newCareServices.length === pageSize);
        setPageCareServices(newPage);
      }
    } catch (error) {
      console.error('Error fetching care services:', error);
      Alert.alert(t('error'), t('fetchCareServicesFailed')); // Thông báo lỗi cho người dùng
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops(0, true);
    fetchCareServices(0, true);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setPageShops(0);
    setPageCareServices(0);
    setHasMoreShops(true);
    setHasMoreCareServices(true);
    await Promise.all([fetchShops(0, true), fetchCareServices(0, true)]);
    setRefreshing(false);
  };

  const loadMoreShops = () => {
    if (!loading && hasMoreShops) {
      fetchShops(pageShops + 1);
    }
  };

  const loadMoreCareServices = () => {
    if (!loading && hasMoreCareServices) {
      fetchCareServices(pageCareServices + 1);
    }
  };

  const renderShopItem = ({ item }) => (
    <TouchableOpacity
      style={styles.shopItem}
      onPress={() => {
        console.log('Navigating to shop:', item.id); // Log để kiểm tra điều hướng
        router.push(`/screen/shop/${item.id}`);
      }}
    >
      <Image
        source={{ uri: item.imageFiles?.[0]?.url || 'https://i.imgur.com/1tMFzp8.png' }}
        style={styles.shopImage}
      />
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>{item.name}</Text>
        <Text style={styles.shopAddress}>{item.address}</Text>
        <Text style={styles.shopDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCareServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.careServiceItem}
      onPress={() => {
        console.log('Navigating to care service:', item.id); // Log để kiểm tra điều hướng
        router.push(`/screen/care-service/${item.id}`);
      }}
    >
      <Text style={styles.careServiceName}>{item.name}</Text>
      <Text style={styles.careServicePrice}>{`${item.price} VNĐ`}</Text>
      <Text style={styles.careServiceDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header />
      <SubHeader />
      <FlatList
        data={[{ type: 'shops' }, { type: 'careServices' }]}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={({ item }) => {
          if (item.type === 'shops') {
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('shops')}</Text>
                <FlatList
                  horizontal
                  data={shops}
                  renderItem={renderShopItem}
                  keyExtractor={(shop, index) => `${shop.id}-${index}`}
                  showsHorizontalScrollIndicator={false}
                  onEndReached={loadMoreShops}
                  onEndReachedThreshold={0.5}
                  ListEmptyComponent={<Text style={styles.emptyText}>{t('noShops')}</Text>} // Thông báo khi không có cửa hàng
                />
              </View>
            );
          } else if (item.type === 'careServices') {
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('careServices')}</Text>
                <FlatList
                  horizontal
                  data={careServices}
                  renderItem={renderCareServiceItem}
                  keyExtractor={(service, index) => `${service.id}-${index}`}
                  showsHorizontalScrollIndicator={false}
                  onEndReached={loadMoreCareServices}
                  onEndReachedThreshold={0.5}
                  ListEmptyComponent={<Text style={styles.emptyText}>{t('noCareServices')}</Text>} // Thông báo khi không có dịch vụ
                />
              </View>
            );
          }
          return null;
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#4EA0B7" />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'nunito-bold',
  },
  shopItem: {
    width: 200,
    marginRight: 15,
    backgroundColor: '#F0F6FD',
    borderRadius: 10,
    padding: 10,
  },
  shopImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'nunito-bold',
  },
  shopAddress: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'nunito-medium',
  },
  shopDescription: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'nunito-medium',
  },
  careServiceItem: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#F0F6FD',
    borderRadius: 10,
    padding: 10,
  },
  careServiceName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'nunito-bold',
  },
  careServicePrice: {
    fontSize: 14,
    color: '#4EA0B7',
    fontFamily: 'nunito-medium',
  },
  careServiceDescription: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'nunito-medium',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'nunito-medium',
  },
});

export default Home;