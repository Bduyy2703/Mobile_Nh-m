import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Header/header";
import { commonStyles } from "../../style";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { database } from "../../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewMessageScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState(null);

  // Lấy userId và fullName từ AsyncStorage
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
  }, []);

  // Lấy danh sách người dùng từ Firestore
  useEffect(() => {
    const q = query(collection(database, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Loại bỏ chính người dùng hiện tại
        if (doc.id !== userId) {
          usersData.push({
            id: doc.id,
            name: data.name,
            avatar: data.avatar || "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg",
          });
        }
      });
      setUsers(usersData);
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => unsubscribe();
  }, [userId]);

  // Lọc danh sách người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Gửi tin nhắn khi chọn một người dùng
  const startChat = async (user) => {
    if (!userId || !fullName) {
      console.error("User data not loaded yet");
      return;
    }

    const newMessage = {
      text: "Hello",
      createdAt: new Date(),
      sender: userId,
      user: {
        _id: userId,
        name: fullName,
        avatar: "https://i.pravatar.cc/300",
      },
      receiver: user.id.toString(),
      _id: Math.random().toString(36),
      read: false,
    };

    try {
      await addDoc(collection(database, "chats"), newMessage);
      navigation.navigate("screen/chat", {
        contact: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const goToCreateGroupScreen = () => {
    navigation.navigate("screen/group");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem} onPress={() => startChat(item)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.friendName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title="New message" />
      <View style={commonStyles.containerContent}>
        <TextInput
          style={styles.input}
          placeholder="To: Type a name or group"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={styles.groupButton}
          onPress={goToCreateGroupScreen}
        >
          <MaterialIcons name="groups" size={24} color="#4EA0B7" />
          <Text style={styles.groupButtonText}>Group chat</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.noUsersText}>No users found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  groupButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  groupButtonText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#4EA0B7",
    fontWeight: "600",
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  friendName: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  noUsersText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default NewMessageScreen;