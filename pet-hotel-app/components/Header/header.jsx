import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = ({ title }) => {
  const router = useRouter();
  return (
      <View style={styles.notificationContainer}>
        <TouchableOpacity onPress={()=>{router.back()}}>
          <Ionicons name="arrow-back" size={24} color='white' />
        </TouchableOpacity>
        <Text style={styles.titleText}>
          {title}
        </Text>
        <Text > 
        </Text>
      </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    paddingBottom: 10,
  },
  notificationContainer: {
    flexDirection: 'row',
    backgroundColor: "#4EA0B7",
    justifyContent: "space-between", 
    alignItems: "center", 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
    padding: 16,
  },
  titleText: {
    fontFamily: "nunito-bold",
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    marginRight:20
  },
});
