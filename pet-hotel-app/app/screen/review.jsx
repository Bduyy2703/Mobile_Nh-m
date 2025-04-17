import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import API from '../../config/AXIOS_API';
import { Ionicons } from '@expo/vector-icons';

export default () => {
    const { bookingId } = useLocalSearchParams();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalSuccess, setModalSuccess] = useState(false);
    const [booking, setBooking] = useState(null);

    // Lấy thông tin booking để có userId và shopId
    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await API.get(`/bookings/${bookingId}`);
                if (response.status === 200) {
                    setBooking(response.data);
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
            }
        };

        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    const handleSubmitReview = async () => {
        if (!rating || rating < 1 || rating > 5) {
            setModalMessage("Vui lòng chọn điểm đánh giá từ 1 đến 5 sao");
            setModalSuccess(false);
            setShowMessageModal(true);
            return;
        }

        if (!feedback.trim()) {
            setModalMessage("Vui lòng nhập nhận xét");
            setModalSuccess(false);
            setShowMessageModal(true);
            return;
        }

        if (!booking) {
            setModalMessage("Không thể xác định thông tin đặt phòng");
            setModalSuccess(false);
            setShowMessageModal(true);
            return;
        }

        setLoading(true);
        try {
            const shopId = booking.careServices?.[0]?.shopId;
            const userId = booking.userId;

            const response = await API.post('/reviews', {
                rating: rating,
                feedback: feedback.trim(),
                userId: userId,
                shopId: shopId,
            });

            if (response.status === 201) {
                setModalMessage("Đánh giá của bạn đã được gửi!");
                setModalSuccess(true);
                setShowMessageModal(true);
            } else {
                setModalMessage("Không thể gửi đánh giá");
                setModalSuccess(false);
                setShowMessageModal(true);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setModalMessage(error.response?.data?.message || "Đã có lỗi xảy ra khi gửi đánh giá");
            setModalSuccess(false);
            setShowMessageModal(true);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"}
                        size={40}
                        color={i <= rating ? "#FFD700" : "#D3D3D3"}
                        style={styles.star}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Viết đánh giá</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Điểm đánh giá</Text>
                <View style={styles.starsContainer}>
                    {renderStars()}
                </View>
                <Text style={styles.label}>Nhận xét của bạn</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập nhận xét của bạn..."
                    placeholderTextColor="#A0A0A0"
                    multiline
                    numberOfLines={5}
                    value={feedback}
                    onChangeText={setFeedback}
                />
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleSubmitReview}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={['#4EA0B7', '#2E6A8A']}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? "Đang gửi..." : "Gửi đánh giá"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Modal thông báo */}
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
    form: {
        flex: 1,
        padding: 20,
    },
    label: {
        color: "#2D2D2D",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    star: {
        marginHorizontal: 5,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 5,
        textAlignVertical: "top",
        fontSize: 16,
        color: "#2D2D2D",
    },
    submitButton: {
        borderRadius: 12,
        overflow: "hidden",
        alignSelf: "center",
        width: 180,
    },
    disabledButton: {
        opacity: 0.6,
    },
    gradientButton: {
        paddingVertical: 15,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
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
    modalButton: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    modalButtonClose: {
        backgroundColor: "#4EA0B7",
        width: 120,
    },
    modalButtonTextClose: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});