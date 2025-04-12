import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router'; 

const Header = ({ title, isBack, isBackground }) => {
  const router = useRouter();
  return (
    // <SafeAreaView style={styles.safeArea}>
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
    // </SafeAreaView>
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
    // backgroundColor: "#416FAE",
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
    // flex:
  },
});
