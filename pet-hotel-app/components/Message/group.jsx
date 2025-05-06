import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { database } from "../../config/firebase";
import { commonStyles } from "../../style";
import Header from "../Header/header";

const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState(null);

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

  useEffect(() => {
    const q = query(collection(database, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
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

  const toggleSelectFriend = (id) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter((friendId) => friendId !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const createGroup = async () => {
    if (selectedFriends.length === 0) {
      alert("Please select at least one friend to create a group.");
      return;
    }

    try {
      const groupData = {
        name: `Group with ${selectedFriends.length + 1} members`,
        members: [userId, ...selectedFriends],
        createdAt: new Date(),
      };
      const groupRef = await addDoc(collection(database, "groups"), groupData);

      const welcomeMessage = {
        text: `${fullName} created this group.`,
        createdAt: new Date(),
        sender: userId,
        user: {
          _id: userId,
          name: fullName,
          avatar: "https://i.pravatar.cc/300",
        },
        receiver: groupRef.id, // ID của nhóm
        _id: Math.random().toString(36),
        read: false,
        isGroup: true,
      };
      await addDoc(collection(database, "chats"), welcomeMessage);

      navigation.navigate("screen/chat", {
        contact: {
          id: groupRef.id,
          name: groupData.name,
          avatar: "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg", 
          isGroup: true,
        },
      });
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    }
  };

  const renderSelectedFriends = () => {
    return selectedFriends.map((friendId) => {
      const friend = users.find((f) => f.id === friendId);
      if (!friend) return null;
      return (
        <View key={friend.id} style={styles.selectedFriend}>
          <Image
            source={{
              uri: typeof contact.avatar === 'string' && contact.avatar
                ? contact.avatar
                : "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg"
            }}
            style={styles.avatar}
          />
          <Text style={styles.selectedFriendName}>{friend.name}</Text>
          <TouchableOpacity onPress={() => toggleSelectFriend(friend.id)}>
            <Text style={styles.removeIcon}>X</Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
   
  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title="New Group" />
      <View style={commonStyles.containerContent}>
        <TextInput
          style={styles.input}
          placeholder="Search friends"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.selectedFriendsContainer}>
          {renderSelectedFriends()}
        </View>
        <Text style={styles.sectionTitle}>Friends</Text>
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.friendItem}
              onPress={() => toggleSelectFriend(item.id)}
            >
              <Image source={{
                uri: typeof item.avatar === 'string' && item.avatar
                  ? item.avatar
                  : "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg"
              }}
                style={styles.avatar}
              />
              <Text style={styles.friendName}>{item.name}</Text>
              {selectedFriends.includes(item.id) ? (
                <Text style={styles.selectedIcon}>✓</Text>
              ) : null}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noUsersText}>No friends found</Text>
          }
        />
        <TouchableOpacity style={styles.createButton} onPress={createGroup}>
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>
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
  selectedFriendsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  selectedFriend: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F0FE",
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  selectedFriendName: {
    fontSize: 14,
    color: "#1A1A1A",
    marginRight: 5,
  },
  removeIcon: {
    fontSize: 16,
    color: "#FF4D4F",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 10,
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
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  selectedIcon: {
    fontSize: 16,
    color: "#4EA0B7",
  },
  createButton: {
    backgroundColor: "#4EA0B7",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  noUsersText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CreateGroupScreen;