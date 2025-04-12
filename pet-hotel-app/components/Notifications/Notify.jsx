import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; // For navigation
import { commonStyles } from "../../style/";
import { router } from "expo-router";
import Header from "../Header/header";

// Sample data for the notifications
const notifications = [
  {
    id: "1",
    title: "Cập nhật đơn hàng",
    description: "Đơn hàng của bạn đã được...",
    icon: require("../../assets/images/hotel.jpg"),
    badge: 13,
  },
  {
    id: "2",
    title: "Lịch hẹn",
    description: "Còn 2 ngày nữa là tới ngày...",
    icon: require("../../assets/images/hotel.jpg"),
    badge: 6,
  },
  {
    id: "3",
    title: "Khuyến mãi",
    description: "Giảm giá 50% tại các cửa hàng...",
    icon: require("../../assets/images/hotel.jpg"),
    badge: 10,
  },
  {
    id: "4",
    title: "Hệ thống",
    description: "Vui lòng cập nhật số điện thoại...",
    icon: require("../../assets/images/hotel.jpg"),
    badge: 1,
  },
  {
    id: "5",
    title: "Cập nhật ApeHome",
    description: "Hãy chia sẻ trải nghiệm của...",
    icon: require("../../assets/images/hotel.jpg"),
    badge: 7,
  },
  {
    id: "6",
    title: "Trò chuyện",
    description: "Bạn có tin nhắn chưa đọc từ...",
    icon: require("../../assets/images/hotel.jpg"),
    badge: 7,
  },
];

// Render each notification item
const NotificationItem = ({ title, description, icon, badge }) => (
  <View style={styles.notificationItem}>
    <View style={styles.iconContainer}>
      <Image source={icon} style={styles.icon} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
    <View style={styles.badgeContainer}>
      <Text style={styles.badge}>{badge}</Text>
    </View>
  </View>
);

const Notify = () => {
  const navigation = useNavigation(); // Hook for navigation

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* <View style={styles.notificationContainer}>
        <Text
          style={{
            fontFamily: "nunito-bold",
            fontSize: 28,
            color: "#fff",
            textAlign: "center",
            marginBottom: 20,
            fontWeight: "500",
            paddingTop: 10,
          }}
        >
          Notifications
        </Text>       
      </View> */}
      <Header title="Notifications" />
      {/* <TouchableOpacity
          style={styles.messageButton}
          onPress={() => navigation.navigate("screen/message")} // Update navigation path
        >
          <Text style={styles.messageButtonText}>Go to Messages</Text>
        </TouchableOpacity> */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            title={item.title}
            description={item.description}
            icon={item.icon}
            badge={item.badge}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Notify;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#777",
  },
  badgeContainer: {
    backgroundColor: "#FF4D4F",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    color: "#fff",
    fontWeight: "bold",
  },
  notificationContainer: {
    backgroundColor: "#4EA0B7",
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    borderBottomLeftRadius: 20, // Rounded bottom-left corner
    borderBottomRightRadius: 20, // Rounded bottom-right corner
    padding: 16,
  },
  messageButton: {
    marginTop: 10,
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  messageButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
