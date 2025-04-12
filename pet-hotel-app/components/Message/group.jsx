import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import Header from "../Header/header";
import { commonStyles } from '../../style';
import { SafeAreaView } from "react-native-safe-area-context";

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

const CreateGroupScreen = () => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [search, setSearch] = useState("");

  const toggleSelectFriend = (id) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter((friendId) => friendId !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const renderSelectedFriends = () => {
    return selectedFriends.map((friendId) => {
      const friend = friendsList.find((f) => f.id === friendId);
      return (
        <View key={friend.id} style={styles.selectedFriend}>
          <Image source={friend.avatar} style={styles.avatarSmall} />
          <Text>{friend.name}</Text>
          <TouchableOpacity onPress={() => toggleSelectFriend(friend.id)}>
            <Text style={styles.removeIcon}>X</Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title="New Group" />

      <View style={commonStyles.containerContent}>
        <TextInput
          style={commonStyles.input}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.selectedFriendsContainer}>
          {renderSelectedFriends()}
        </View>
        <Text style={styles.sectionTitle}>Friend</Text>
        <FlatList
          data={friendsList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.friendItem}
              onPress={() => toggleSelectFriend(item.id)}
            >
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.friendName}>{item.name}</Text>
              {selectedFriends.includes(item.id) ? (
                <Text style={styles.selectedIcon}>✓</Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  selectedFriendsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  selectedFriend: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  removeIcon: {
    marginLeft: 5,
    color: "red",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
    flex: 1,
    fontSize: 16,
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default CreateGroupScreen;
