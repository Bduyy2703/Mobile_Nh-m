import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Sliders() {
  return (
    <View style={{ padding: 10 }}>
      <Text style={styles.title}>Hotels</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.scroll}>
          <Image
            source={require("./../../assets/images/hotel.jpg")}
            style={styles.image}
          />
          <Text style={styles.subtitle}>Hotel 1</Text>
          <View
            style={styles.icon}
          >
            <Ionicons name="location" size={20} color="black" />
            <Text style={{ marginLeft: 5 }}>District 9, HCMC</Text>
          </View>
          <Text style={styles.price}>300.000 VND</Text>
        </View>

        <View style={styles.scroll}>
          <Image
            source={require("./../../assets/images/hotel-1.jpg")}
            style={styles.image}
          />
          <Text style={styles.subtitle}>Hotel 2</Text>
          <View
            style={styles.icon}
          >
            <Ionicons name="location" size={20} color="black" />
            <Text style={{ marginLeft: 5 }}>District 9, HCMC</Text>
          </View>
          <Text style={styles.price}>300.000 VND</Text>
        </View>

        <View style={styles.scroll}>
          <Image
            source={require("./../../assets/images/hotel-2.jpg")}
            style={styles.image}
          />
          <Text style={styles.subtitle}>Hotel 3</Text>
          <View
            style={styles.icon}
          >
            <Ionicons name="location" size={20} color="black" />
            <Text style={{ marginLeft: 5 }}>District 9, HCMC</Text>
          </View>
          <Text style={styles.price}>300.000 VND</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: "nunito-bold",
    padding: 10,
    marginBottom: 10,
  },
  scroll: {
    width: 280,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "#DADADA",
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: 250,
    height: 130,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "nunito-bold",
    paddingTop: 8,
  },
  price: {
    paddingTop: 5,
    fontWeight: "600",
    fontFamily: "nunito-bold",
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
  },
});
