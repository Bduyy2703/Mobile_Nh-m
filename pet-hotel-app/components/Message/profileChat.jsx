import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

const ProfileChat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} />
        </TouchableOpacity>

        <Entypo name="dots-three-vertical" size={24} color="black" />
      </View>
      <View style={styles.subheader}>
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        <Text>{contact.name}</Text>
      </View>
      <View style={styles.icon}>
        <TouchableOpacity style={styles.content}>
          <Ionicons name="search" size={24} color="black" />
          <Text style={{fontSize: 16}}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.content}>
          <FontAwesome name="user" size={24} color="black" />
          <Text style={{fontSize: 16}}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.content}>
          <Ionicons name="notifications-sharp" size={24} color="black" />
          <Text style={{fontSize: 16}}>Notification</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.subContent}>
        <TouchableOpacity style={styles.subIcon}>
          <MaterialIcons name="block" size={24} color="black" />
          <Text style={styles.text}>Block</Text>
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.subIcon}>
          <Feather name="alert-triangle" size={24} color="black" />
          <Text style={styles.text}>Report</Text>
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.subIcon}>
          <MaterialIcons name="delete" size={24} color="black" />
          <Text style={styles.text}>Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subheader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  subContent: {
    flexDirection: "column",
    marginLeft: 10,
    marginTop: 20,
  },
  subIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  text: {
    marginLeft: 15,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 5,
  },
});
