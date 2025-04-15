import { useRouter,useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import check from './../../assets/images/check.png'; // Đảm bảo đường dẫn chính xác
import SuccessIcon from "./../../assets/images/success.png";

const SuccessScreen = () => {
    const router = useRouter();
    const {orderCode} = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Image source={check} style={styles.image} />
            <Text style={styles.successMessage}>Thanh toán thành công!</Text>
            <Text style={styles.details}>
                Cảm ơn bạn đã thanh toán. Đơn hàng ({orderCode}) của bạn đang được xử lý.
            </Text>
            <Button
                title="Quay lại trang chủ"
                onPress={() => router.push('home')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 150, 
        height: 150,
        marginBottom: 20, 
    },
    successMessage: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 10,
    },
    details: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default SuccessScreen;
