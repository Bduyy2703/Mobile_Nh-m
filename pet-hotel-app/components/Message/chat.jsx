import React, { useState, useEffect } from "react";
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
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRoute, useNavigation } from "@react-navigation/native";
import { collection, addDoc, orderBy, query, onSnapshot, where, updateDoc, doc } from 'firebase/firestore';
import { database } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'; // Thêm moment để định dạng thời gian

const ChatDetailScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [isGroup, setIsGroup] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { contact } = route.params;

  // Lấy thông tin userId và receiverId
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const name = await AsyncStorage.getItem('fullName');
        setUserId(storedUserId);
        setFullName(name);
        setReceiverId(contact.id);
        setIsGroup(contact.isGroup || false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [contact]);

  // Lấy dữ liệu tin nhắn từ Firebase
  useEffect(() => {
    if (!userId || !receiverId) return;

    let q;
    if (isGroup) {
      // Nếu là nhóm chat, lấy tin nhắn dựa trên receiver (ID của nhóm)
      q = query(
        collection(database, 'chats'),
        where('receiver', '==', receiverId),
        orderBy('createdAt', 'asc')
      );
    } else {
      // Nếu là trò chuyện cá nhân, lấy tin nhắn dựa trên sender và receiver
      q = query(
        collection(database, 'chats'),
        where('sender', 'in', [userId, receiverId]),
        where('receiver', 'in', [userId, receiverId]),
        orderBy('createdAt', 'asc')
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id, // Sử dụng ID của document để cập nhật trạng thái đọc
          text: data.text,
          time: moment(data.createdAt.toDate()).calendar(),
          isSender: data.sender === userId,
          sender: data.sender,
          user: data.user,
          read: data.read || false,
        };
      });

      setMessages(messagesData);

      // Đánh dấu các tin nhắn chưa đọc là đã đọc
      const unreadMessages = querySnapshot.docs.filter(doc => {
        const data = doc.data();
        return !data.read && data.sender !== userId;
      });

      unreadMessages.forEach(async (doc) => {
        try {
          await updateDoc(doc.ref, { read: true });
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
      });
    }, (error) => {
      console.error('Error fetching messages:', error);
    });

    return () => unsubscribe();
  }, [userId, receiverId, isGroup]);

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      text: inputText,
      createdAt: new Date(),
      sender: userId,
      user: {
        _id: userId,
        name: fullName,
        avatar: 'https://i.pravatar.cc/300',
      },
      receiver: receiverId,
      _id: Math.random().toString(36),
      read: false,
      isGroup: isGroup,
    };
    setInputText('');

    try {
      await addDoc(collection(database, 'chats'), newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Render từng tin nhắn
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSender ? styles.sender : styles.receiver,
      ]}
    >
      {!item.isSender && isGroup && (
        <Image
          source={{ uri: item.user.avatar }}
          style={styles.messageAvatar}
        />
      )}
      <View style={styles.messageContent}>
        {isGroup && !item.isSender && (
          <Text style={styles.senderName}>{item.user.name}</Text>
        )}
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
      {item.isSender && isGroup && (
        <Image
          source={{ uri: item.user.avatar }}
          style={styles.messageAvatar}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#1A1A1A" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerContent}
          onPress={() => navigation.navigate("screen/profileChat", { contact })}
        >
          <Image
            source={{
              uri: typeof contact.avatar === 'string' && contact.avatar
                ? contact.avatar
                : "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg"
            }}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.name}>{contact.name}</Text>
            {!isGroup && (
              <Text style={styles.onlineStatus}>Online</Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("screen/profileChat", { contact })}>
          <AntDesign name="infocirlce" size={24} color="#4EA0B7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        style={styles.chatContainer}
        inverted
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity>
          <Ionicons name="image-outline" size={25} color="#7F7F7F" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={25} color="#4EA0B7" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 15,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  onlineStatus: {
    fontSize: 12,
    color: "#4EA0B7",
    fontWeight: "500",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "80%",
    marginVertical: 5,
  },
  sender: {
    alignSelf: "flex-end",
  },
  receiver: {
    alignSelf: "flex-start",
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  messageContent: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4EA0B7",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  messageTime: {
    fontSize: 10,
    color: "#7F7F7F",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F1F1F1",
    fontSize: 16,
  },
});

export default ChatDetailScreen;