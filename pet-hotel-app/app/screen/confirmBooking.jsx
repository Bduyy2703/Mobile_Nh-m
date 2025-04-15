import React, { useEffect, useState } from 'react'
import { View, ScrollView, Image, Text, ImageBackground, StyleSheet, TouchableOpacity, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header/header";
import { commonStyles } from "../../style";
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/AXIOS_API';
import moment from 'moment';

const ConfirmBooking = () => {
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);
    const { id } = useLocalSearchParams();

    const shopId = AsyncStorage.getItem("shopId");
    const token = AsyncStorage.getItem("token");

    const [shop, setShop] = useState([]);
    const [room, setRoom] = useState([]);
    const [service, setService] = useState([]);
    const [days,setDays]= useState(0);
    const [tax,settTax] = useState(0.1);
    const [discount,setDiscount] = useState(0);
    const selectedServiceNames = service
        .filter(service => bookingData.serviceIds.includes(service.id))
        .map(service => service.name);

    const selectedServicePrices = service
        .filter(service => bookingData.serviceIds.includes(service.id))
        .map(service => service.price);
    const servicePrice = selectedServicePrices.reduce((acc, price) => acc + price, 0);
    
    {/* fetch data */ }
    useEffect (() => {
        const fetchPremium = async () => {
            const premium = await AsyncStorage.getItem('isPremium');
            console.log("Premium",premium);
            premium == "true" ? setIsPremium(true): setIsPremium(false);
            
        }
        fetchPremium();
    },[])

    const fetchBookingData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('booking');

            if (storedData) {
                (isPremium==true) ? settTax(0.05) : settTax(0.1);
            (isPremium==true) ? setDiscount(0.1) : setDiscount(0);

                const parsedData = JSON.parse(storedData);
                setBookingData(parsedData);
                const startDate = moment(parsedData.startDate);
                const endDate = parsedData.endDate ? moment(parsedData.endDate) : null;
                if (endDate) {
                    const day = endDate.diff(startDate, 'days');
                    setDays(day);
                    console.log("Số ngày giữa hai ngày:", day);
                } else {
                    console.log("endDate không hợp lệ.");
                }
                console.log("Parsed Booking Data:", parsedData);
            } else {
                console.log("No booking data found");
            }
        } catch (error) {
            console.error('Error loading booking data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomDetails = async () => {
        try {
            const response = await API.get(`/rooms/${bookingData.roomId}`);
            if (response.data) {
                setRoom(response.data);
            }
            console.log("Room Details:", response.data);
        } catch (error) {
            console.error("Error fetching Room Details confirm booking:", error);
        }
    };
    const fetchServices = async () => {
        try {
            const response = await API.get(`/services/shops/${id}`);
            if (response.data) {
                setService(response.data.content);
            }
            // console.log("Services:", response.data.content);
        } catch (error) {
            console.error("Error fetching services booking:", error);
        }
    };

    const router = useRouter();




    useEffect(() => {
        fetchBookingData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // if (bookingData.roomId) {
            await fetchServices();
            // fetchShopDetails(); // Uncomment if needed
            // fetchRoomDetails(); // Uncomment if needed
            // }
        };

        fetchData();
    }, [bookingData]);



    const handleBooking = async () => {
        console.log("Token:", token);
        const tokencc = token._j;
        console.log("Tokencc:", tokencc);


        try {
            const body = {
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                note: bookingData.note,
                // totalPrice: bookingData.totalPrices,
                roomId: bookingData.roomId,
                // roomId: 1,
                petId: bookingData.petId,
                userId: bookingData.userId,
                serviceIds: bookingData.serviceIds
            };

            console.log("Request Body:", body);

            const response = await API.post("/bookings", body, {
                headers: {
                    Authorization: `Bearer ${tokencc}`,
                },
            });
            if (response.status === 201) {
                console.log("Services:", response.data);
                router.push({
                    pathname: 'screen/bookingSuccess',
                    params: {id: response.data.id}
                });
            }
        } catch (error) {
            console.error("Error fetching create booking:", error);
        }
    }

    return (
        <SafeAreaView style={commonStyles.container}>
            <Header title='Xác nhận đặt' />
            <ScrollView style={commonStyles.containerContent}>
                <View style={styles.shopSection}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <ImageBackground
                            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                            resizeMode={'stretch'}
                            imageStyle={styles.view3}
                            style={styles.view2}
                        >
                        </ImageBackground>
                    </View>

                    <View style={styles.column}>
                        {/* <View style={styles.row3}>
                            <View style={styles.view4}>
                            </View>
                            <Text style={styles.text7}>
                                {"4.8"}
                            </Text>
                        </View> */}
                        <Text style={styles.text4}>
                            {"KATYB PET CARE"}
                        </Text>
                        <View style={styles.row4}>
                            <Image
                                source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                                resizeMode={"stretch"}
                                style={styles.image6}
                            />
                            <Text style={styles.text5}>
                                {"Quận 9"}
                            </Text>
                        </View>
                        <Text style={styles.text6}>
                            {"150.000VND/Ngày"}
                        </Text>
                    </View>

                </View>
                <View style={styles.row5}>
                    <Text style={styles.text8}>
                        {"Ngày đặt"}
                    </Text>
                    <Text style={styles.text9}>
                        {loading ? "..." : (bookingData ? bookingData.dateBooking : "Chưa có dữ liệu đặt phòng")}
                    </Text>
                </View>
                <View style={styles.row6}>
                    <Text style={styles.text8}>
                        {"Ngày gửi"}
                    </Text>
                    <Text style={styles.text9}>
                        {loading ? "..." : (bookingData ? bookingData.startDate : "Chưa có dữ liệu đặt phòng")}
                    </Text>
                </View>
                <View style={styles.row5}>
                    <Text style={styles.text8}>
                        {"Ngày trả"}
                    </Text>
                    <Text style={styles.text9}>
                        {loading ? "..." : (bookingData ? bookingData.endDate : "Chưa có dữ liệu đặt phòng")}
                    </Text>
                </View>
                <View style={styles.row7}>
                    <Text style={styles.text8}>
                        {"Dịch vụ"}
                    </Text>
                    {selectedServiceNames.length === 0 ? (
                        <Text style={styles.text9}>
                            {"Không dùng dịch vụ"}
                        </Text>
                    ) : (
                        <View>
                            {selectedServiceNames.map((name, index) => (
                                <Text key={index}>{name}</Text>
                            ))}
                        </View>
                    )}

                </View>
                <View style={styles.box3}>
                </View>
                <View style={styles.row8}>
                    <Text style={styles.text8}>
                        {"Thành tiền "}
                    </Text>
                    <Text style={styles.text9}>
                        {loading ? "..." : (bookingData ? bookingData.totalPrices * days + servicePrice : "Chưa có dữ liệu đặt phòng")}
                    </Text>
                </View>
                <View style={styles.row9}>
                    <Text style={styles.text8}>
                        {"Phí dịch vụ"}
                    </Text>
                    <Text style={styles.text9}>
                        {loading ? "..." : (bookingData ? ((bookingData.totalPrices * days + servicePrice) * (isPremium ? 0.05 : 0.1))  : "Chưa có dữ liệu đặt phòng")}
                    </Text>
                </View>
                {/* {isPremium == true && (
                    <View style={styles.row9}>
                    <Text style={styles.text8}>
                        {"Giảm giá Premium"}
                    </Text>
                    <Text style={styles.text9}>
                        {loading ? "..." : (bookingData ? ((((bookingData.totalPrices * days + servicePrice) * (isPremium ? 0.05 : 0.1)) + (bookingData.totalPrices * days + servicePrice)) * ((isPremium ? 0.1 : 0)))  : "Chưa có dữ liệu đặt phòng")}
                    </Text>
                </View>
                )} */}
                
                <View style={styles.row10}>
                    <Text style={styles.text8}>
                        {"Tổng tiền"}
                    </Text>
                    <Text style={styles.text9}>
                        {loading ? "..." : (bookingData ? (((bookingData.totalPrices * days + servicePrice) * (isPremium ? 0.05 : 0.1)) + (bookingData.totalPrices * days + servicePrice)) : "Chưa có dữ liệu đặt phòng")}
                        {/* - ((((bookingData.totalPrices * days + servicePrice) * (isPremium ? 0.05 : 0.1)) + (bookingData.totalPrices * days + servicePrice)) * ((isPremium ? 0.1 : 0))) */}
                    </Text>
                </View>
                <View style={styles.box4}>
                </View>
                <View style={styles.row11}>
                    <Image
                        source={{ uri: "https://static-00.iconduck.com/assets.00/qr-scan-icon-512x512-9bsp061y.png" }}
                        resizeMode={"stretch"}
                        style={styles.image7}
                    />
                    <Text style={styles.text8}>
                        {"QR Code"}
                    </Text>
                    <View style={styles.box5}>
                    </View>
                    <Text style={styles.text7}>
                        {"Thay đổi"}
                    </Text>
                </View>
                <View style={commonStyles.mainButtonContainer}>
                    <TouchableOpacity onPress={handleBooking} style={commonStyles.mainButton}>
                        <Text style={commonStyles.textMainButton}>Đặt ngay</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    box: {
        flex: 1,
    },
    box2: {
        height: 7,
        backgroundColor: "#000000",
        borderRadius: 1,
        marginTop: 2,
    },
    box3: {
        height: 1,
        marginBottom: 25,
        marginHorizontal: 33,
    },
    box4: {
        width: 318,
        height: 1,
        marginBottom: 27,
        marginHorizontal: 31,
    },
    box5: {
        flex: 1,
        alignSelf: "stretch",
    },
    box6: {
        height: 10,
        backgroundColor: "#C3D7DD",
        borderRadius: 10,
        marginHorizontal: 119,
    },
    column: {
        flex: 1,
        // width: 121,
        // marginRight: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    image: {
        width: 9,
        height: 16,
        marginTop: 11,
        marginRight: 19,
    },
    image2: {
        width: 17,
        height: 10,
        marginRight: 5,
    },
    image3: {
        width: 15,
        height: 11,
        marginRight: 6,
    },
    image4: {
        width: 30,
        height: 30,
        marginTop: 6,
    },
    image5: {
        width: 12,
        height: 12,
    },
    image6: {
        width: 11,
        height: 16,
        marginRight: 8,
    },
    image7: {
        width: 20,
        height: 20,
        marginRight: 10,
    },

    shopSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingVertical: 14,
        marginBottom: 73,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOpacity: 1.0,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 10,
        elevation: 10,
    },
    row3: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    row4: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 11,
    },
    row5: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 13,
        marginHorizontal: 40,
    },
    row6: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
        marginHorizontal: 40,
    },
    row7: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
        marginHorizontal: 39,
    },
    row8: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginHorizontal: 39,
    },
    row9: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 19,
        marginHorizontal: 39,
    },
    row10: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 23,
        marginHorizontal: 38,
    },
    row11: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 113,
        marginHorizontal: 45,
    },
    text3: {
        color: "#4EA0B7",
        fontSize: 12,
        fontWeight: "bold",
    },
    text4: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 7,
        marginLeft: 1,
    },
    text5: {
        color: "#AEACAC",
        fontSize: 12,
        fontWeight: "bold",
        flex: 1,
    },
    text6: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 4,
    },
    text7: {
        color: "#4EA0B7",
        fontSize: 12,
        fontWeight: "bold",
    },
    text8: {
        color: "#999999",
        fontSize: 14,
        fontWeight: "bold",
    },
    text9: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "bold",
    },
    text10: {
        color: "#FDFBF6",
        fontSize: 18,
        fontWeight: "bold",
    },
    view: {
        width: 22,
        alignSelf: "flex-start",
        borderColor: "#000000",
        borderRadius: 2,
        borderWidth: 1,
        paddingHorizontal: 2,
    },
    view2: {
        width: 127,
        height: 108,
        paddingLeft: 92,
        paddingRight: 5,
        marginRight: 17,
    },
    view3: {
        borderRadius: 15,
    },
    view4: {
        width: 43,
        alignItems: "center",
        backgroundColor: "#FFF5F0",
        borderRadius: 2,
        paddingVertical: 5,
    },
    view5: {
        alignItems: "center",
        backgroundColor: "#4EA0B7",
        borderRadius: 30,
        paddingVertical: 21,
        marginBottom: 32,
        marginHorizontal: 60,
    },
});

export default ConfirmBooking