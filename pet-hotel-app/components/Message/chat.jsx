import React, { useState } from "react";
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
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native"; // To get the selected message
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

const messages = [
  {
    id: 1,
    text: "Chào shop, mình muốn book lịch dành cho thú cưng",
    time: "12:05",
    isSender: true,
  },
  {
    id: 2,
    text: "PetShop xin chào, bạn muốn đặt lịch loại dịch vụ nào vậy ạ?",
    time: "12:06",
    isSender: false,
  },
];

const ChatDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { contact } = route.params; // get passed contact details

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} />
        </TouchableOpacity>
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        <View style={styles.headerContent}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.onlineStatus}>online 10 giây trước</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("screen/profileChat", {contact})}>
          <AntDesign name="infocirlce" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        style={styles.chatContainer}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="image-outline" size={25} color="#7F7F7F" />
        <TextInput style={styles.input} placeholder="Aa" />
        <Ionicons name="send" size={25} color="#68A7AD" />
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
