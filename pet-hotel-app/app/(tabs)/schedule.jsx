import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Thêm useRouter để điều hướng
import Header from '../../components/Header/header';
import { commonStyles } from '../../style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/AXIOS_API';

const Schedule = () => {
    const router = useRouter(); // Khởi tạo router để điều hướng
    const [status, setStatus] = useState(1); // Default to 'Pending'
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

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleBookingPress = (booking) => {
        // Điều hướng đến màn hình Booking Details và truyền thông tin booking
        router.push({
            pathname: '/screen/bookingDetails',
            params: {
                bookingId: booking.id,
                shopName: booking.shopName,
                type: booking.type,
                dateBooking: booking.dateBooking,
                totalPrice: booking.totalPrice,
            },
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => handleBookingPress(item)} // Thêm sự kiện onPress để điều hướng
        >
            <Image
                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                resizeMode={"cover"}
                style={styles.image}
            />
            <View style={styles.itemContent}>
                <Text style={styles.shopName}>{item.shopName}</Text>
                <Text style={styles.textItem}>
                    Sử dụng: {item.type === "1" ? "Phòng" : item.type === "2" ? "Dịch vụ" : "Phòng, dịch vụ"}
                </Text>
                <Text style={styles.textItem}>Đặt hàng: {formatDate(item.dateBooking)}</Text>
                <Text style={styles.textItem}>Tổng tiền: {formatPrice(item.totalPrice)} VND</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={commonStyles.container}>
            <Header title={"Theo dõi lịch"} />
            <View style={styles.statusBar}>
                <TouchableOpacity
                    onPress={() => setStatus(1)}
                    style={[
                        styles.statusBtn,
                        status === 1 ? styles.statusBtnActive : styles.statusBtnInactive,
                    ]}
                >
                    <Text style={status === 1 ? styles.statusTextActive : styles.statusTextInactive}>
                        PENDING
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setStatus(2)}
                    style={[
                        styles.statusBtn,
                        status === 2 ? styles.statusBtnActive : styles.statusBtnInactive,
                    ]}
                >
                    <Text style={status === 2 ? styles.statusTextActive : styles.statusTextInactive}>
                        SUCCESS
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={bookings}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && <ActivityIndicator size="large" color="#4EA0B7" />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#4EA0B7']}
                    />
                }
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    statusBar: {
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    statusBtn: {
        width: 120,
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
    },
    statusBtnActive: {
        backgroundColor: '#4EA0B7',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
    },
    statusBtnInactive: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    statusTextActive: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusTextInactive: {
        color: '#2D2D2D',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginVertical: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 5,
    },
    image: {
        borderRadius: 12,
        width: 100,
        height: 100,
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
    },
    shopName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D2D2D',
        marginBottom: 5,
    },
    textItem: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 3,
    },
});

export default Schedule;