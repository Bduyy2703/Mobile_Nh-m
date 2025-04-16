import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import API from "../../config/AXIOS_API";

const ShopList = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { type } = useLocalSearchParams(); // Lấy tham số type (nếu có, ví dụ: "hotel")
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await API.get("/shops");
        if (response.status === 200) {
          // Lấy dữ liệu từ response.data.content thay vì response.data
          const allShops = response.data.content || response.data;
          console.log("All Shops:", allShops); // Log để kiểm tra dữ liệu

          // Lọc danh sách shop dựa trên type (kiểm tra trong mảng services)
          const filteredShops = type
            ? allShops.filter((shop) =>
                shop.services.some((service) => service.type === type)
              )
            : allShops;

          setShops(filteredShops);
          console.log("Filtered Shops:", filteredShops); // Log để kiểm tra danh sách đã lọc
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
    console.log("Navigating to shop details:", shopId); // Log để kiểm tra điều hướng
    router.push({
      pathname: "/screen/details",
      params: { id: shopId },
    });
  };

  const renderShopItem = ({ item }) => (
    <TouchableOpacity
      style={styles.shopItem}
      onPress={() => handleShopPress(item.id)}
    >
      <Text style={styles.shopName}>{item.name}</Text>
      <Text style={styles.shopAddress}>{item.address}</Text>
      <Text style={styles.shopDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4EA0B7" />
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
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  shopItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "nunito-bold",
  },
  shopAddress: {
    fontSize: 14,
    color: "#7F7F7F",
    fontFamily: "nunito-medium",
  },
  shopDescription: {
    fontSize: 14,
    color: "#7F7F7F",
    fontFamily: "nunito-medium",
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