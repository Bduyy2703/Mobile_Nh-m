import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import API from '../../config/AXIOS_API';
import { Ionicons } from '@expo/vector-icons';

export default () => {
    const { shopId } = useLocalSearchParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNo, setPageNo] = useState(0);
    const [pageSize] = useState(10);
    const [sortBy] = useState("id");
    const [sortDir] = useState("desc");
    const [hasMore, setHasMore] = useState(true);

    const fetchReviews = async (page) => {
        setLoading(true);
        try {
            const response = await API.get(`/reviews/shops/${shopId}`, {
                params: {
                    shopId: shopId,
                    pageNo: page,
                    pageSize: pageSize,
                    sortBy: sortBy,
                    sortDir: sortDir,
                },
            });
            if (response.status === 200) {
                const newReviews = response.data.content || [];
                setReviews((prev) => page === 0 ? newReviews : [...prev, ...newReviews]);
                setHasMore(newReviews.length === pageSize);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (shopId) {
            fetchReviews(pageNo);
        }
    }, [shopId, pageNo]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={20}
                    color={i <= rating ? "#FFD700" : "#D3D3D3"}
                    style={styles.star}
                />
            );
        }
        return stars;
    };

    const renderReview = ({ item }) => (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.starsContainer}>
                    {renderStars(item.rating)}
                </View>
                <Text style={styles.reviewUser}>Người dùng #{item.userId}</Text>
            </View>
            <Text style={styles.reviewFeedback}>{item.feedback}</Text>
        </View>
    );

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPageNo((prev) => prev + 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Đánh giá cửa hàng</Text>
            </View>
            {loading && pageNo === 0 ? (
                <ActivityIndicator size="large" color="#4EA0B7" style={{ marginTop: 20 }} />
            ) : reviews.length === 0 ? (
                <Text style={styles.noReviews}>Chưa có đánh giá nào</Text>
            ) : (
                <FlatList
                    data={reviews}
                    renderItem={renderReview}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.reviewsList}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && hasMore ? (
                            <ActivityIndicator size="small" color="#4EA0B7" style={{ marginVertical: 20 }} />
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6F5",
    },
    header: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        color: "#4EA0B7",
        fontSize: 24,
        fontWeight: "bold",
    },
    reviewsList: {
        padding: 20,
    },
    reviewCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 5,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: "row",
    },
    star: {
        marginRight: 5,
    },
    reviewUser: {
        color: "#6B7280",
        fontSize: 14,
    },
    reviewFeedback: {
        color: "#2D2D2D",
        fontSize: 16,
    },
    noReviews: {
        color: "#6B7280",
        fontSize: 16,
        textAlign: "center",
        marginTop: 50,
    },
});