import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import API from '../../config/AXIOS_API';
import { Ionicons } from '@expo/vector-icons';
import Header from "../../components/Header/header";

export default () => {
    const { bookingId } = useLocalSearchParams();
    const router = useRouter();
    const [booking, setBooking] = useState(null);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalSuccess, setModalSuccess] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);

    const fetchBookingDetails = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/bookings/${bookingId}`);
            if (response.status === 200) {
                setBooking(response.data);
                if (response.data.careServices && response.data.careServices.length > 0) {
                    const shopId = response.data.careServices[0].shopId;
                    const shopResponse = await API.get(`/shops/${shopId}`);
                    if (shopResponse.status === 200) {
                        setShop(shopResponse.data);
                    }
                }
            } else {
                setModalMessage("Không thể lấy thông tin đặt phòng");
                setModalSuccess(false);
                setShowMessageModal(true);
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
            setModalMessage("Đã có lỗi xảy ra khi lấy thông tin đặt phòng");
            setModalSuccess(false);
            setShowMessageModal(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusText = (status) => {
        switch (status) {
            case "PENDING":
                return "Chưa xác nhận";
            case "CONFIRMED":
                return "Xác nhận";
            case "COMPLETED":
                return "Đánh giá";
            default:
                return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "#FF9800";
            case "CONFIRMED":
                return "#4CAF50";
            case "COMPLETED":
                return "#2196F3";
            default:
                return "#757575";
        }
    };

    const handleCancelBooking = async () => {
        setCancelling(true);
        try {
            const response = await API.put(`/bookings/cancel/${bookingId}`, {
                status: "CANCELLED"
            });
            if (response.status === 200) {
                setModalMessage("Đặt phòng đã được hủy thành công");
                setModalSuccess(true);
                setShowMessageModal(true);
            } else {
                setModalMessage("Không thể hủy đặt phòng");
                setModalSuccess(false);
                setShowMessageModal(true);
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setModalMessage(error.response?.data?.message || "Đã có lỗi xảy ra khi hủy đặt phòng");
            setModalSuccess(false);
            setShowMessageModal(true);
        } finally {
            setCancelling(false);
            setShowCancelModal(false);
        }
    };

    const handleCameraPress = () => {
        setModalMessage("Tính năng xem camera đang được phát triển!");
        setModalSuccess(false);
        setShowMessageModal(true);
    };

    const handleReviewPress = () => {
        router.push({
            pathname: '/screen/review',
            params: { bookingId: bookingId },
        });
    };

    const handleViewReviewsPress = () => {
        const shopId = booking?.careServices?.[0]?.shopId;
        if (shopId) {
            router.push({
                pathname: '/screen/reviewList',
                params: { shopId: shopId },
            });
        } else {
            setModalMessage("Không thể xác định cửa hàng để xem đánh giá");
            setModalSuccess(false);
            setShowMessageModal(true);
        }
    };

    const renderService = ({ item }) => (
        <View style={styles.serviceItem}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.servicePrice}>{formatPrice(item.price)} VND</Text>
            <Text style={styles.serviceDescription}>{item.description}</Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size={30} color="#4EA0B7" style={{ marginTop: 50 }} />
            </SafeAreaView>
        );
    }

    if (!booking) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Không tìm thấy thông tin đặt phòng</Text>
            </SafeAreaView>
        );
    }

    return (
  
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
            <Header title="Thông tin đặt phòng"/>
                <View style={styles.header}>
                    <Image
                        source={{ uri: shop?.imageFiles?.[0]?.url || "https://i.imgur.com/1tMFzp8.png" }}
                        resizeMode="cover"
                        style={styles.headerImage}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.5)', 'transparent']}
                        style={styles.headerGradient}
                    />
                    <Text style={styles.headerTitle}>{shop?.name || "Không xác định"}</Text>
                </View>

                <View style={styles.statusContainer}>
                    <View style={[styles.statusBox, { backgroundColor: getStatusColor(booking.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={20} color="#4EA0B7" />
                        <Text style={styles.infoText}>{shop?.address || "Không xác định"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={20} color="#4EA0B7" />
                        <Text style={styles.infoText}>{shop?.phone || "Không xác định"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="pricetag-outline" size={20} color="#4EA0B7" />
                        <Text style={styles.infoText}>Tổng tiền: {formatPrice(booking.totalPrice)} VND</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#4EA0B7" />
                        <Text style={styles.infoText}>
                            Từ: {formatDate(booking.startDate)} - Đến: {formatDate(booking.endDate)}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color="#4EA0B7" />
                        <Text style={styles.infoText}>Ngày đặt: {formatDateTime(booking.dateBooking)}</Text>
                    </View>
                    {booking.note && (
                        <View style={styles.infoRow}>
                            <Ionicons name="document-text-outline" size={20} color="#4EA0B7" />
                            <Text style={styles.infoText}>Ghi chú: {booking.note}</Text>
                        </View>
                    )}
                </View>

                {booking.careServices && booking.careServices.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Dịch vụ đã chọn</Text>
                        <FlatList
                            data={booking.careServices}
                            renderItem={renderService}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.servicesList}
                        />
                    </>
                )}

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleCameraPress}>
                        <LinearGradient
                            colors={['#4EA0B7', '#2E6A8A']}
                            style={styles.gradientButton}
                        >
                            <Ionicons name="videocam-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.actionButtonText}>Xem Camera</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {booking.status === "PENDING" && (
                        <TouchableOpacity
                            style={[styles.cancelButton, cancelling && styles.disabledButton]}
                            onPress={() => setShowCancelModal(true)}
                            disabled={cancelling}
                        >
                            <Ionicons name="close-circle-outline" size={20} color="#FF6B6B" style={styles.buttonIcon} />
                            <Text style={styles.cancelButtonText}>
                                {cancelling ? "Đang hủy..." : "Hủy đặt phòng"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {booking.status === "COMPLETED" && (
                        <TouchableOpacity style={styles.actionButton} onPress={handleReviewPress}>
                            <LinearGradient
                                colors={['#4EA0B7', '#2E6A8A']}
                                style={styles.gradientButton}
                            >
                                <Ionicons name="star-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                                <Text style={styles.actionButtonText}>Viết đánh giá</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.actionButton} onPress={handleViewReviewsPress}>
                        <LinearGradient
                            colors={['#4EA0B7', '#2E6A8A']}
                            style={styles.gradientButton}
                        >
                            <Ionicons name="chatbubbles-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.actionButtonText}>Xem đánh giá</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                transparent={true}
                visible={showCancelModal}
                animationType="fade"
                onRequestClose={() => setShowCancelModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Xác nhận hủy đặt phòng</Text>
                        <Text style={styles.modalMessage}>
                            Bạn có chắc chắn muốn hủy đặt phòng này không?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => setShowCancelModal(false)}
                            >
                                <Text style={styles.modalButtonTextCancel}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonConfirm]}
                                onPress={handleCancelBooking}
                            >
                                <Text style={styles.modalButtonTextConfirm}>Đồng ý</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                transparent={true}
                visible={showMessageModal}
                animationType="fade"
                onRequestClose={() => {
                    setShowMessageModal(false);
                    if (modalSuccess) router.back();
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Ionicons
                            name={modalSuccess ? "checkmark-circle" : "close-circle"}
                            size={50}
                            color={modalSuccess ? "#4CAF50" : "#FF6B6B"}
                            style={styles.modalIcon}
                        />
                        <Text style={styles.modalTitle}>
                            {modalSuccess ? "Thành công" : "Lỗi"}
                        </Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonClose]}
                            onPress={() => {
                                setShowMessageModal(false);
                                if (modalSuccess) router.back();
                            }}
                        >
                            <Text style={styles.modalButtonTextClose}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6F5",
    },
    scrollView: {
        flex: 1,
    },
    header: {
        position: "relative",
        height: 200,
        marginBottom: 20,
    },
    headerImage: {
        width: "100%",
        height: "100%",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerGradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "50%",
    },
    headerTitle: {
        position: "absolute",
        bottom: 20,
        left: 20,
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    statusContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    statusBox: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    statusText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 5,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    infoText: {
        color: "#2D2D2D",
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
    },
    sectionTitle: {
        color: "#2D2D2D",
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 20,
        marginBottom: 15,
    },
    servicesList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    serviceItem: {
        backgroundColor: "#E8F0F2",
        borderRadius: 12,
        padding: 15,
        marginRight: 15,
        width: 150,
        alignItems: "center",
    },
    serviceName: {
        color: "#2D2D2D",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    servicePrice: {
        color: "#6B7280",
        fontSize: 12,
        marginBottom: 5,
    },
    serviceDescription: {
        color: "#6B7280",
        fontSize: 10,
        textAlign: "center",
    },
    actionsContainer: {
        marginHorizontal: 20,
        marginBottom: 30,
        gap: 15,
    },
    actionButton: {
        borderRadius: 12,
        overflow: "hidden",
    },
    gradientButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
    },
    buttonIcon: {
        marginRight: 10,
    },
    actionButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#FF6B6B",
        borderRadius: 12,
        paddingVertical: 13,
    },
    disabledButton: {
        opacity: 0.6,
    },
    cancelButtonText: {
        color: "#FF6B6B",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "#2D2D2D",
        fontSize: 16,
        textAlign: "center",
        marginTop: 50,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 20,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        color: "#2D2D2D",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    modalMessage: {
        color: "#6B7280",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    modalIcon: {
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 15,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    modalButtonCancel: {
        backgroundColor: "#E0E0E0",
    },
    modalButtonConfirm: {
        backgroundColor: "#4EA0B7",
    },
    modalButtonClose: {
        backgroundColor: "#4EA0B7",
        width: 120,
    },
    modalButtonTextCancel: {
        color: "#2D2D2D",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalButtonTextConfirm: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalButtonTextClose: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});