import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header/header";
import { commonStyles } from "../../style";
import SuccessIcon from "./../../assets/images/success.png";
import API from '../../config/AXIOS_API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { use } from 'i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';

const BookingSuccess = () => {
    const [bookingData, setBookingData] = useState(null);
    const router = useRouter();

    const {id} = useLocalSearchParams();

    useEffect(() => {
        // Fetch the booking data and token from AsyncStorage
        const fetchBookingData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('booking');
                
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setBookingData(parsedData);
                    console.log("Booking Data:", parsedData);
                } else {
                    console.log("No booking data found");
                }
            } catch (error) {
                console.error('Error loading booking data:', error);
            }
        };

        fetchBookingData();
    }, []);

    const returnUrl = "http://192.168.100.10:8081/screen/success";
    const cancelUrl = "http://192.168.100.10:8081/screen/cancel";

    const handlePayment = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log("Token:", token);
        console.log("Booking Data:", bookingData?.id);
        try {
            const response = await API.post(`/payment/create-paymentlink/booking/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
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
                    }
                });
            }
        } catch (error) {
            console.error('Error handling payment:', error);
        }
    };

    // const handlePayment = () => {
    //     router.push('screen/payment');
    // }

    return (
        <SafeAreaView style={commonStyles.container}>
            <Header title={"Đặt phòng thành công"} />
            <ScrollView style={commonStyles.containerContent}>
                <View style={styles.successContainer}>
                    <View style={{ alignItems: 'center', margin: 20 }}>
                        <Image source={SuccessIcon}></Image>
                    </View>
                    <Text style={styles.text3}>
                        {"Đặt phòng thành công!"}
                    </Text>
                    <Text style={styles.text4}>
                        {"ApeHome cảm ơn bạn đã mua hàng."}
                    </Text>
                </View>
                <TouchableOpacity style={styles.view3} onPress={handlePayment}>
                    <Text style={styles.text5}>
                        {"Tiến hành thanh toán"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center'}}>
                    <Text style={styles.text6}>
                        {"Trang chủ"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    successContainer: {
        marginTop: 50,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text3: {
        color: "#4EA0B7",
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 13,
    },
    text4: {
        color: "#000000",
        fontSize: 16,
        marginBottom: 178,
    },
    text5: {
        color: "#FDFBF6",
        fontSize: 18,
        fontFamily: 'nunito-bold',
    },
    text6: {
        color: "#4EA0B7",
        fontSize: 18,
        marginBottom: 30,
        fontFamily: 'nunito-bold',
    },
    view3: {
        alignItems: "center",
        backgroundColor: "#4EA0B7",
        borderRadius: 30,
        paddingVertical: 15,
        marginBottom: 34,
        marginHorizontal: 32,
    },
});

export default BookingSuccess;