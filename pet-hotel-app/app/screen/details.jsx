import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import ChatIcon from "./../../assets/images/chat.png";
import API from "../../config/AXIOS_API";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Details = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [shopData, setShopData] = useState({});
  const [serviceData, setServiceData] = useState([]);
  const [reviewData, setReviewData] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const name = await AsyncStorage.getItem("fullName");
        setUserId(storedUserId);
        setFullName(name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/shops/${id}`);
        if (response.status === 200) {
          setShopData(response.data);
          console.log("Shop data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    const fetchReviewData = async () => {
      try {
        const response = await API.get(`/reviews/shops/${id}?pageNo=0&pageSize=10&sortBy=id&sortDir=desc`);
        if (response.status === 200) {
          const { content, totalElements } = response.data;
          // Tính averageRating trên frontend
          const averageRating =
            content.length > 0
              ? content.reduce((sum, review) => sum + review.rating, 0) / content.length
              : 0;
          setReviewData({
            averageRating: averageRating,
            totalReviews: totalElements || 0,
          });
          console.log("Review data:", { averageRating, totalElements });
        }
      } catch (error) {
        console.error("Error fetching review data:", error);
      }
    };

    const fetchServiceData = async () => {
      try {
        const response = await API.get(`/services/shops/${id}`);
        if (response.status === 200) {
          setServiceData(response.data.content);
          console.log("Service data:", response.data.content);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    if (id) {
      Promise.all([fetchShopData(), fetchReviewData(), fetchServiceData()])
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBooking = () => {
    router.push({
      pathname: "/screen/booking",
      params: { id: id },
    });
  };

  const handleViewReviews = () => {
    router.push({
      pathname: "/screen/reviewList",
      params: { shopId: id, shopName: shopData.name },
    });
  };

  const sendMessage = async () => {
    const newMessage = {
      text: "Hello",
      createdAt: new Date(),
      sender: userId,
      user: {
        _id: userId,
        name: fullName,
        avatar: "https://i.pravatar.cc/300",
      },
      receiver: shopData.userId.toString(),
      _id: Math.random().toString(36),
    };
    await addDoc(collection(database, "chats"), newMessage);
    navigation.navigate("(tabs)", { screen: "chat" });
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4EA0B7" style={styles.loader} />
      ) : (
        <>
          <ScrollView style={styles.scrollView}>
            <ImageBackground
              source={{
                uri:
                  shopData?.imageFiles?.length > 0
                    ? shopData.imageFiles
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].url
                    : "https://i.imgur.com/1tMFzp8.png",
              }}
              resizeMode="cover"
              imageStyle={styles.coverImage}
              style={styles.coverContainer}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </ImageBackground>

            <View style={styles.shopInfo}>
              <View style={styles.shopDetails}>
                <Text style={styles.shopNameText}>{shopData.name}</Text>
                <Text style={styles.shopAddressText}>{shopData.address}</Text>
              </View>
              <TouchableOpacity onPress={sendMessage} style={styles.chatButton}>
                <Image source={ChatIcon} resizeMode="contain" style={styles.chatIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleViewReviews} style={styles.ratingContainer}>
              <View style={styles.ratingWrapper}>
                <Ionicons name="star" size={20} color="#FFD700" style={styles.starIcon} />
                <Text style={styles.ratingText}>{reviewData.averageRating.toFixed(1)}</Text>
              </View>
              <Text style={styles.reviewsText}>
                {reviewData.totalReviews > 0
                  ? `${reviewData.totalReviews} nhận xét`
                  : "Chưa có nhận xét"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.descriptionText}>{shopData.description || "Chưa có mô tả."}</Text>

            <Text style={styles.sectionTitle}>Các dịch vụ</Text>
            {serviceData.length > 0 ? (
              serviceData.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Text style={styles.serviceText}>{service.name}</Text>
                  <Text style={styles.servicePrice}>
                    {formatPrice(service.price)} VND / ngày
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noServiceText}>Chưa có dịch vụ nào.</Text>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Tổng giá</Text>
              <Text style={styles.priceText}>
                {serviceData.length > 0
                  ? `Từ ${formatPrice(serviceData[0].price)} VND / ngày`
                  : "Giá không khả dụng"}
              </Text>
            </View>
            <TouchableOpacity onPress={handleBooking} style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Đặt ngay</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    height: 300,
    padding: 16,
  },
  coverImage: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 8,
    alignSelf: "flex-start",
  },
  shopInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  shopDetails: {
    flex: 1,
  },
  shopNameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  shopAddressText: {
    fontSize: 14,
    color: "#666666",
  },
  chatButton: {
    backgroundColor: "#4EA0B7",
    borderRadius: 50,
    padding: 10,
  },
  chatIcon: {
    width: 24,
    height: 24,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E8F0FE",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    marginRight: 8,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4EA0B7",
  },
  reviewsText: {
    fontSize: 14,
    color: "#4EA0B7",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 22,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  serviceText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  servicePrice: {
    fontSize: 14,
    color: "#4EA0B7",
    fontWeight: "600",
  },
  noServiceText: {
    fontSize: 15,
    color: "#666666",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 3,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  bookButton: {
    backgroundColor: "#4EA0B7",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default Details;