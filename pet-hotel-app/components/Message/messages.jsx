import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../Header/header";
import { commonStyles } from "../../style";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { collection, query, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import { database } from "../../config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const MessageScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userCache, setUserCache] = useState({});
  const [groupCache, setGroupCache] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
        console.log("user", storedUserId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  async function getUserById(userId) {
    if (typeof userId !== 'string') {
      console.error('userId phải là một chuỗi!');
      return null;
    }
    if (userCache[userId]) {
      return userCache[userId];
    }

    const userDocRef = doc(database, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUserCache(prev => ({ ...prev, [userId]: userData }));
      return userData;
    } else {
      console.log('No such user document!');
      return null;
    }
  }

  async function getGroupById(groupId) {
    if (typeof groupId !== 'string') {
      console.error('groupId phải là một chuỗi!');
      return null;
    }
    if (groupCache[groupId]) {
      return groupCache[groupId];
    }

    const groupDocRef = doc(database, 'groups', groupId);
    const groupDoc = await getDoc(groupDocRef);

    if (groupDoc.exists()) {
      const groupData = groupDoc.data();
      setGroupCache(prev => ({ ...prev, [groupId]: groupData }));
      return groupData;
    } else {
      console.log('No such group document!');
      return null;
    }
  }

  useEffect(() => {
    const fetchMessages = () => {
      const collectionRef = collection(database, 'chats');
      const q = query(collectionRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const messagesData = {};
        const userPromises = [];
        const groupPromises = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Kiểm tra nếu là nhóm chat
          if (data.isGroup) {
            if (data.receiver && !messagesData[data.receiver]) {
              groupPromises.push(getGroupById(data.receiver).then(groupInfo => {
                if (groupInfo && groupInfo.members.includes(userId)) {
                  const currentTime = new Date(data.createdAt.seconds * 1000);
                  messagesData[data.receiver] = {
                    id: data.receiver,
                    name: groupInfo.name,
                    message: data.text,
                    time: moment(currentTime).calendar(),
                    avatar: "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg",
                    read: data.read || false,
                    isGroup: true,
                  };
                }
              }));
            }
          } else {
            // Trò chuyện cá nhân
            if ((data.sender === userId || data.receiver === userId)) {
              const key = data.sender === userId ? data.receiver : data.sender;
              userPromises.push(getUserById(key).then(userInfo => {
                if (userInfo && !messagesData[key]) {
                  const currentTime = new Date(data.createdAt.seconds * 1000);
                  messagesData[key] = {
                    id: key,
                    name: userInfo.name,
                    message: data.text,
                    time: moment(currentTime).calendar(),
                    avatar: userInfo.avatar || "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg",
                    read: data.read || false,
                    isGroup: false,
                  };
                }
              }));
            }
          }
        });

        await Promise.all([...userPromises, ...groupPromises]);

        setMessages(Object.values(messagesData));
        console.log("Messages Data:", messagesData);
      }, (error) => {
        console.error("Error fetching messages:", error);
      });

      return unsubscribe;
    };

    let unsubscribe;

    if (userId) {
      unsubscribe = fetchMessages();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => navigation.navigate("screen/chat", {
        contact: {
          id: item.id,
          name: item.name,
          avatar: item.avatar,
          isGroup: item.isGroup,
        }
      })}
    >
      <Image source={{
        uri: typeof item.avatar === 'string' && item.avatar
          ? item.avatar
          : "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg"
      }}
        style={styles.avatar}
      />
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
          {item.message}
        </Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.time}>{item.time}</Text>
        {!item.read && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>New</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title="Chats" />
      <View style={commonStyles.containerContent}>
        <View style={commonStyles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="gray"
            style={commonStyles.searchIcon}
          />
          <TextInput style={commonStyles.searchInput} placeholder="Search" />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("screen/newMessage")}
        >
          <Ionicons name="add" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  message: {
    fontSize: 14,
    color: "#7F7F7F",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 12,
    color: "#7F7F7F",
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: "#FF4D4F",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#4EA0B7",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default MessageScreen;