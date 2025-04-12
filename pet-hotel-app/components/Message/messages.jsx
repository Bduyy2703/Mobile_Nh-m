import React from "react";
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
import { useNavigation } from "@react-navigation/native"; // For navigation

const messages = [
  {
    id: 1,
    name: "Martin Randolph",
    message: "Bạn: Xin chào! Tôi tên...",
    time: "19:40",
    avatar: "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg",
    read: false,
  },
  {
    id: 2,
    name: "Andrew Parker",
    message: "Bạn: Ô! Cảm ơn nhiều",
    time: "6:35",
    avatar: "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg",
    read: true,
  },
  {
    id: 3,
    name: "Karen Castillo",
    message: "Bye, mai gặp nha!",
    time: "T5",
    avatar: "https://esx.bigo.sg/eu_live/2u6/2ZuCJH.jpg",
    read: true,
  },
];

const MessageScreen = () => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => navigation.navigate("screen/chat", { contact: item })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
      {item.read ? (
        <Icon name="done-all" size={20} color="blue" />
      ) : (
        <Icon name="circle" size={12} color="gray" />
      )}
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
          keyExtractor={(item) => item.id.toString()}
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
  container: {
    backgroundColor: "white",
  },
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
  }
});

export default MessageScreen;
