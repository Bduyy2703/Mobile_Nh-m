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
import API from "../../config/AXIOS_API";

const ShopList = () => {
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
          // Nếu có type, lọc danh sách shop theo type (tuỳ chọn)
          const allShops = response.data;
          const filteredShops = type
            ? allShops.filter((shop) => shop.type === type) // Thay shop.type bằng thuộc tính thực tế của API
            : allShops;
          setShops(filteredShops);
          console.log("Danh sách shop:", filteredShops);
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={shops}
          renderItem={renderShopItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
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
  },
  shopAddress: {
    fontSize: 14,
    color: "#7F7F7F",
  },
});

export default ShopList;