import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  const router = useRouter();
  const handleNotification = () => {
    router.push("/screen/notifications");
  };

  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.title}>Hello,</Text>
        <Text style={styles.title}>Welcome back</Text>
      </View>

      <TouchableOpacity onPress={handleNotification}>
        <Ionicons name="notifications" size={30} color="#4EA0B7" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FDFBF6",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 20,
    marginTop: 50,
  },

  title: {
    fontSize: 24,
    marginRight: 20,
    color: "#4EA0B7",
    fontFamily: "nunito-bold",
  },
});
