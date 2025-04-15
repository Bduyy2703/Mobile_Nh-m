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

const MessageScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
        console.log("user", userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [userId]);

  async function getUserById(userId) {
    if (typeof userId !== 'string') {
      console.error('userId phải là một chuỗi!');
      return null;
    }
    const userDocRef = doc(database, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User Data:', userData);
      return userData;
    } else {
      console.log('No such document!');
      return null;
    }
  }

  // useEffect(() => {
  //   const fetchMessages = () => {
  //     const collectionRef = collection(database, 'chats');
  //     const q = query(collectionRef, orderBy('createdAt', 'desc'));

  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       const messagesData = {};

  //       querySnapshot.forEach((doc) => {
  //         const data = doc.data();
  //         const key = data.sender === userId ? data.receiver : data.sender;
  //         const userInfo =  getUserById(key);
  //         const currentTime = new Date(data.createdAt.seconds * 1000);

  //         if (!messagesData[key] ) {
  //           messagesData[key] = {
  //             id: key,
  //             name: data.user.name, 
  //             message: data.text,
  //             time: currentTime.toLocaleTimeString(),
  //             avatar: "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg", 
  //             read: false, 
  //           };
  //         }
  //       });


  //       setMessages(Object.values(messagesData));
  //       console.log("cc",messagesData);

  //     });

  //     return unsubscribe;
  //   };

  //   if (userId) {
  //     const unsubscribe = fetchMessages();
  //     return () => unsubscribe(); 
  //   }
  // }, [userId])

  useEffect(() => {
    const fetchMessages = () => {
      const collectionRef = collection(database, 'chats');
      const q = query(collectionRef, orderBy('createdAt', 'desc'));


      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const messagesData = {};
        const userPromises = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.sender === userId || data.receiver === userId) {
            const key = data.sender === userId ? data.receiver : data.sender;
            console.log("key",key);
            userPromises.push(getUserById(key).then(userInfo => {
              if (userInfo) {
                const currentTime = new Date(data.createdAt.seconds * 1000);
                if (!messagesData[key]) {
                  messagesData[key] = {
                    id: key,
                    name: userInfo.name,
                    message: data.text,
                    time: currentTime.toLocaleTimeString(),
                    avatar: "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg",
                    read: false,
                  };
                }
              }
            }));
          }


          // userPromises.push(getUserById(key).then(userInfo => {
          //   if (userInfo) {
          //     const currentTime = new Date(data.createdAt.seconds * 1000);
          //     if (!messagesData[key]) {
          //       messagesData[key] = {
          //         id: key,
          //         name: userInfo.name,
          //         message: data.text,
          //         time: currentTime.toLocaleTimeString(),
          //         avatar: "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg",
          //         read: false,
          //       };
          //     }
          //   }
          // }));
          
        });

        await Promise.all(userPromises);

        setMessages(Object.values(messagesData));
        console.log("Messages Data:", messagesData);
      });

      return unsubscribe;
    };

    let unsubscribe;

    if (userId!=null) {
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
          avatar: item.avatar
        }
      })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
          {item.message}
        </Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
      {/* {item.read ? (
        <Icon name="done-all" size={20} color="blue" />
      ) : (
        <Icon name="circle" size={12} color="gray" />
      )} */}
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

        {/* <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("screen/newMessage")}
        >
          <Ionicons name="add" size={25} color="white" />
        </TouchableOpacity> */}
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
  },
  message: {
    fontSize: 14,
    color: "#7F7F7F",
  },
  time: {
    fontSize: 12,
    color: "#7F7F7F",
    marginRight: 10,
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
