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
import { collection, addDoc, orderBy, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { database } from '../../config/firebase'; // Import Firestore config
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatDetailScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState(null); // Lấy userId từ AsyncStorage
  const [fullName, setFullName] = useState(null); // Lấy userId từ AsyncStorage
  const [receiverId, setReceiverId] = useState(null); // Lấy receiverId
  const route = useRoute();
  const navigation = useNavigation();
  const { contact } = route.params;

  const [receiver, setReceiver] = useState({});

  // Lấy thông tin userId và receiverId
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const name = await AsyncStorage.getItem('fullName');
        setUserId(storedUserId);
        setReceiverId(contact.id);
        setFullName(name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();

  }, [contact]);


  // Lấy dữ liệu tin nhắn từ Firebase
  useEffect(() => {
    if (!userId || !receiverId) return;

    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs
          .map(doc => doc.data())
          .filter(
            message =>
              (message.sender === userId && message.receiver === receiverId) ||
              (message.sender === receiverId && message.receiver === userId)
          )
          .map(doc => ({
            id: doc._id,
            text: doc.text,
            time: doc.createdAt.toDate().toLocaleTimeString(),
            isSender: doc.sender === userId,
          }))
      );
    });

    return unsubscribe;
  }, [userId, receiverId]);

  console.log("asd",messages);
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
        avatar: 'https://i.pravatar.cc/300'
      },
      receiver: receiverId,
      _id: Math.random().toString(36),
    };
    setInputText('');

    await addDoc(collection(database, 'chats'), newMessage);
  };

  // Render từng tin nhắn
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSender ? styles.sender : styles.receiver,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} />
        </TouchableOpacity>
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        <View style={styles.headerContent}>
          <Text style={styles.name}>{contact.name}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("screen/profileChat", { contact })}>
          <AntDesign name="infocirlce" size={24} color="black" />
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
        <Ionicons name="image-outline" size={25} color="#7F7F7F" />
        <TextInput
          style={styles.input}
          placeholder="Aa"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={25} color="#68A7AD" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 15,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#222',
  },
  onlineStatus: {
    fontSize: 12,
    color: "#7F7F7F",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: "75%",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  sender: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  receiver: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: "#7F7F7F",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "#F1F1F1",
  },
});

export default ChatDetailScreen;
