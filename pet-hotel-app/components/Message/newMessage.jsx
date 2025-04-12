import React, { useState } from "react";
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

const friendsList = [
  {
    id: 1,
    name: "Martha Craig",
    avatar: require("../../assets/images/hotel.jpg"),
  },
  {
    id: 2,
    name: "Kieron Dotson",
    avatar: require("../../assets/images/hotel.jpg"),
  },
  {
    id: 3,
    name: "Zack John",
    avatar: require("../../assets/images/hotel.jpg"),
  },
  {
    id: 4,
    name: "Jamie Franco",
    avatar: require("../../assets/images/hotel.jpg"),
  },
  {
    id: 5,
    name: "Tabitha Potter",
    avatar: require("../../assets/images/hotel.jpg"),
  },
];

const NewMessageScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const filteredFriends = friendsList.filter((friend) =>
    friend.name.toLowerCase().includes(search.toLowerCase())
  );

  const goToCreateGroupScreen = () => {
    navigation.navigate("screen/group");
  };

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
          <MaterialIcons name="groups" size={24} color="black" />
          <Text style={styles.groupButtonText}>Group chat</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.friendName}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    backgroundColor: "#FDFBF6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4EA0B7",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  groupButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  groupButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  friendName: {
    fontSize: 16,
  },
});

export default NewMessageScreen;
