import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { database } from "../../config/firebase";
import { commonStyles } from "../../style";
import Header from "../Header/header";

const Notify = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(database, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notificationsData.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          icon: data.icon || "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg",
          badge: data.read ? 0 : 1,
          type: data.type,
          targetId: data.targetId,
        });
      });
      setNotifications(notificationsData);
    }, (error) => {
      console.error("Error fetching notifications:", error);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleNotificationPress = async (notification) => {
    try {
      await updateDoc(doc(database, "notifications", notification.id), {
        read: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    switch (notification.type) {
      case "order_update":
        navigation.navigate("screen/orderDetails", { orderId: notification.targetId });
        break;
      case "appointment":
        navigation.navigate("screen/appointmentDetails", { appointmentId: notification.targetId });
        break;
      case "promotion":
        navigation.navigate("screen/promotions");
        break;
      case "system":
        navigation.navigate("screen/settings");
        break;
      case "apehome_update":
        navigation.navigate("screen/feedback");
        break;
      case "chat":
        navigation.navigate("screen/chat", {
          contact: { id: notification.targetId },
        });
        break;
      default:
        break;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.iconContainer}>
     <Image
              source={{
                uri: typeof contact.icon === 'string' && contact.icon
                  ? contact.icon
                  : "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg"
              }}
              style={styles.avatar}
            />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
      </View>
      {item.badge > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>New</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title="Notifications" />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.noNotificationsText}>No notifications found</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
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
    color: "#1A1A1A",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666666",
  },
  badgeContainer: {
    backgroundColor: "#FF4D4F",
    borderRadius: 15,
    width: 40,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  noNotificationsText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Notify;