import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import API from "../../config/AXIOS_API";
import Header from "../../components/Header/header";

const ShopList = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await API.get("/shops");
        if (response.status === 200) {
          const allShops = response.data.content || response.data;
          console.log("All Shops:", allShops);

          const filteredShops = type
            ? allShops.filter((shop) =>
                shop.services.some((service) => service.type === type)
              )
            : allShops;

          setShops(filteredShops);
          console.log("Filtered Shops:", filteredShops);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách shop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [type]);

  const handleShopPress = (shopId) => {
    console.log("Navigating to shop details:", shopId);
    router.push({
      pathname: "/screen/details",
      params: { id: shopId },
    });
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const renderShopItem = ({ item }) => {
    // Lấy ảnh từ imageFiles
    const shopImage =
      item.imageFiles && item.imageFiles.length > 0
        ? item.imageFiles[0].url
        : "https://i.imgur.com/1tMFzp8.png";

    // Tìm giá thấp nhất từ services
    const lowestPrice = item.services.length > 0
      ? Math.min(...item.services.map((service) => service.price))
      : null;

    // Lấy danh sách các loại dịch vụ duy nhất
    const serviceTypes = [...new Set(item.services.map((service) => service.type))];

    return (
      <TouchableOpacity
        style={styles.shopItem}
        onPress={() => handleShopPress(item.id)}
      >
        <Image
          source={{ uri: shopImage }}
          style={styles.shopImage}
          resizeMode="cover"
        />
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{item.name}</Text>
          <Text style={styles.shopAddress}>{item.address}</Text>
          <Text style={styles.shopDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.serviceTypesContainer}>
            {serviceTypes.map((type, index) => (
              <Text key={index} style={styles.serviceType}>
                {type}
              </Text>
            ))}
          </View>
          {lowestPrice !== null && (
            <Text style={styles.shopPrice}>
              Giá từ {formatPrice(lowestPrice)} VND
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Shop" />
      {loading ? (
        <ActivityIndicator size={30} color="#4EA0B7" />
      ) : (
        <FlatList
          data={shops}
          renderItem={renderShopItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {t("noShopsForType", "Không có cửa hàng phù hợp với loại dịch vụ này")}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F5", // Màu nền nhẹ nhàng
    padding: 15,
  },
  list: {
    paddingBottom: 20,
  },
  shopItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginVertical: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5, // Hiệu ứng bóng cho Android
  },
  shopImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: "#E0E0E0", // Màu nền tạm thời khi ảnh đang tải
  },
  shopInfo: {
    flex: 1,
    justifyContent: "center",
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D2D2D",
    fontFamily: "nunito-bold",
    marginBottom: 5,
  },
  shopAddress: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "nunito-medium",
    marginBottom: 5,
  },
  shopDescription: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "nunito-medium",
    marginBottom: 8,
  },
  serviceTypesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "#4EA0B7", // Màu nền cho loại dịch vụ
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
    fontFamily: "nunito-medium",
  },
  shopPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4EA0B7",
    fontFamily: "nunito-bold",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "nunito-medium",
  },
});

export default ShopList;