import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header/header';
import { commonStyles } from '../../style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/AXIOS_API';

const Schedule = () => {
    const [status, setStatus] = useState(1);  // Default to 'Pending'
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
            const userIdcc = await AsyncStorage.getItem('userId');
            setUserId(userIdcc);
        };

        fetchUserId();
    }, []);

    const fetchData = async (newPage = 1, reset = false) => {
        if (!userId || loading) return; 
        setLoading(true);
        
        try {
            const endpoint = status === 1 
                ? `bookings/pending/users/${userId}` 
                : `bookings/completed/users/${userId}`;
            
            // console.log(`Fetching data from ${endpoint} with page: ${newPage}`);

            const response = await API.get(`${endpoint}?pageNo=${newPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
            
            if (response.status === 200) {
                const newBookings = response.data.content;
                setBookings(prevBookings => reset ? newBookings : [...prevBookings, ...newBookings]);
                setHasMore(newBookings.length > 0);
            }
        } catch (error) {
            console.error('Error fetching bookings', error);
        }

        setLoading(false);
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
            const nextPage = page + 1;
            setPage(nextPage);
            fetchData(nextPage);
        }
    };
    const handleRefresh = async () => {
        setRefreshing(true);
        setPage(1); 
        await fetchData(0, true); 
        setRefreshing(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.item} key={item.id}>
            <Image
                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                resizeMode={"stretch"}
                style={styles.image}
            />
            <View style={{ marginLeft: 15 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.shopName}</Text>
                <Text style={styles.textItem}>Sử dụng: {item.type === "1" ? "Phòng" : item.type === "2" ? "Dịch vụ" : "Phòng, dịch vụ"}</Text>
                <Text style={styles.textItem}>Đặt hàng: {new Date(item.dateBooking).toISOString().substring(0, 19)}</Text>
                <Text style={styles.textItem}>Tổng tiền: {item.totalPrice}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={commonStyles.container}>
            <Header title={"Theo dõi lịch"} />
            <View style={styles.statusBar}>
                <TouchableOpacity onPress={() => setStatus(1)}
                    style={[
                        styles.statusBtn,
                        { backgroundColor: status === 1 ? '#555' : '#fff' }
                    ]}>
                    <Text style={{ color: status === 1 ? '#fff' : '#000' }}>PENDING</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStatus(2)}
                    style={[
                        styles.statusBtn,
                        { backgroundColor: status === 2 ? '#555' : '#fff' }
                    ]}>
                    <Text style={{ color: status === 2 ? '#fff' : '#000' }}>SUCCESS</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={bookings}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && <ActivityIndicator size={30} color="#0000ff" />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh} 
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Schedule;

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
    },
});
