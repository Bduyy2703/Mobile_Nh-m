import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { commonStyles } from "../../style";
import { Text, Button, View, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import Header from '../../components/Header/header';
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from 'react-native';
import API from '../../config/AXIOS_API';

const Premium = () => {
    const [userId, setUserId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserId = async () => {
            const userIdcc = await AsyncStorage.getItem("userId");
            setUserId(userIdcc);
        };
        fetchUserId();
    }, []);

    const handleUpgrade = async () => {
        const returnUrl = "http://192.168.100.10:8081/screen/success";
        const cancelUrl = "http://192.168.100.10:8081/screen/cancel";
        const price = 50000;
        const token = await AsyncStorage.getItem('token');
        console.log("Token:", token);
        try {
            const response = await API.post(`/payment/create-paymentlink/subscription/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    price,
                    returnUrl: returnUrl,
                    cancelUrl: cancelUrl,
                }
            });

            if (response.data) {
                console.log("Payment Link:", response.data);                
                // Use Linking to open the payment URL in the web browser
                // if (checkoutUrl) {
                //     Linking.openURL(checkoutUrl).catch((err) => console.error('Failed to open URL:', err));
                // }

                const { accountName, accountNumber, amount, bin, description, qrCode, orderCode, paymentLinkId } = response.data;
                console.log("Account name:", accountName);
                console.log("Account number:", accountNumber);
                console.log("Amount:", amount);
                console.log("BIN:", bin);
                console.log("Description:", description);
                console.log("QR Code:", qrCode);
                console.log("Order Code:", orderCode);
                console.log("Payment Link ID:", paymentLinkId);

                const type= "premium";
                router.push({
                    pathname: 'screen/payment',
                    params: {
                        accountName,
                        accountNumber,
                        amount,
                        bin,
                        description,
                        qrCode,
                        orderCode,
                        paymentLinkId,
                        type
                    }
                });
            }
        } catch (error) {
            console.error('Error handling payment:', error);
        }
        // router.push('/payment');
    };

    return (
        <SafeAreaView style={commonStyles.container}>
            <Header title={"Nâng cấp Premium"} />
            <View style={commonStyles.containerContent}>
                <Text style={styles.description}>
                    Nâng cấp tài khoản Premium để nhận giảm 10% trên mỗi hóa đơn với giá 50.000 VND / tháng.
                </Text>

                <Text style={styles.benefitsTitle}>Quyền lợi tài khoản Premium:</Text>
                <View style={styles.benefits}>
                    <Text style={styles.benefitItem}>✓ Giảm 10% trên mỗi hóa đơn</Text>
                    <Text style={styles.benefitItem}>✓ Ưu tiên hỗ trợ khách hàng</Text>
                    <Text style={styles.benefitItem}>✓ Truy cập sớm các tính năng mới</Text>
                </View>

                <View style={commonStyles.mainButtonContainer}>
                    <TouchableOpacity onPress={handleUpgrade} style={commonStyles.mainButton}>
                        <Text style={commonStyles.textMainButton}>NÂNG CẤP NGAY</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        margin: 15,
    },
    benefitsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
    },
    benefits: {
        marginLeft: 20,
        marginBottom: 20,
    },
    benefitItem: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default Premium;
