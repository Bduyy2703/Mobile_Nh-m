import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { collection, query, where, getDocs, addDoc, deleteDocs } from "firebase/firestore";
import { database } from "../../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileChat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact } = route.params;
  const [userId, setUserId] = useState(null);

  // Lấy userId từ AsyncStorage
  React.useEffect(() => {
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

  // Chặn người dùng
  const handleBlock = async () => {
    if (!userId) return;
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${contact.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              await addDoc(collection(database, "blockedUsers"), {
                userId: userId,
                blockedUserId: contact.id,
                createdAt: new Date(),
              });
              Alert.alert("Success", `${contact.name} has been blocked.`);
              navigation.goBack();
            } catch (error) {
              console.error("Error blocking user:", error);
              Alert.alert("Error", "Failed to block user. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Báo cáo người dùng
  const handleReport = async () => {
    if (!userId) return;
    Alert.alert(
      "Report User",
      `Are you sure you want to report ${contact.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: async () => {
            try {
              await addDoc(collection(database, "reports"), {
                reporterId: userId,
                reportedUserId: contact.id,
                reason: "Reported from chat",
                createdAt: new Date(),
              });
              Alert.alert("Success", "Your report has been submitted.");
            } catch (error) {
              console.error("Error reporting user:", error);
              Alert.alert("Error", "Failed to report user. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Xóa cuộc trò chuyện
  const handleDelete = async () => {
    if (!userId) return;
    Alert.alert(
      "Delete Chat",
      `Are you sure you want to delete your conversation with ${contact.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const q = query(
                collection(database, "chats"),
                where("sender", "in", [userId, contact.id]),
                where("receiver", "in", [userId, contact.id])
              );
              const querySnapshot = await getDocs(q);
              const batch = deleteDocs(querySnapshot);
              await Promise.all(
                querySnapshot.docs.map((doc) => batch.doc(doc.id).delete())
              );
              Alert.alert("Success", "Conversation deleted.");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting conversation:", error);
              Alert.alert("Error", "Failed to delete conversation. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#1A1A1A" />
        </TouchableOpacity>
        <Entypo name="dots-three-vertical" size={24} color="#1A1A1A" />
      </View>
      <View style={styles.subheader}>
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{contact.name}</Text>
      </View>
      <View style={styles.icon}>
        <TouchableOpacity style={styles.content}>
          <Ionicons name="search" size={24} color="#4EA0B7" />
          <Text style={styles.optionText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.content}>
          <FontAwesome name="user" size={24} color="#4EA0B7" />
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.content}>
          <Ionicons name="notifications-sharp" size={24} color="#4EA0B7" />
          <Text style={styles.optionText}>Notification</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.subContent}>
        <TouchableOpacity style={styles.subIcon} onPress={handleBlock}>
          <MaterialIcons name="block" size={24} color="#FF4D4F" />
          <Text style={styles.text}>Block</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.subIcon} onPress={handleReport}>
          <Feather name="alert-triangle" size={24} color="#FF4D4F" />
          <Text style={styles.text}>Report</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.subIcon} onPress={handleDelete}>
          <MaterialIcons name="delete" size={24} color="#FF4D4F" />
          <Text style={styles.text}>Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subheader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#4EA0B7",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 10,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#4EA0B7",
    marginTop: 5,
  },
  subContent: {
    flexDirection: "column",
    marginLeft: 10,
    marginTop: 20,
  },
  subIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  text: {
    marginLeft: 15,
    fontSize: 16,
    color: "#FF4D4F",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 5,
  },
});

export default ProfileChat;