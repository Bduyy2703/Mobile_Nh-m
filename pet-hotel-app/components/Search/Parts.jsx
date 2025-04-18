import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Parts() {
  const [isSelected, setIsSelected] = useState(1);
  const router = useRouter();
  const handleBooking = async () => {
    router.push('/screen/details');
  }

  const renderHotelItem = ({ item }) => (
    <TouchableOpacity onPress={handleBooking} >
      <View style={styles.container}>
        {/* <Image source={item.image} style={styles.image} /> */}
        <View>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name="star"
                size={15}
                color={index < item.rating ? "gold" : "black"}
              />
            ))}
            <Text style={styles.subtitle}>{/*{item.rating} ({item.reviews} Reviewers)*/}</Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="black" />
            <Text style={styles.subtitle}>{item.location}</Text>
          </View>
          <Text style={styles.subtitle}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>

  );

  return (
    <View style={{ padding: 25 }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10 }}>
        <Text style={{fontSize:16}}>
          Recommend
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "#DADADA",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  image: {
    width: 135,
    height: 100,
    borderRadius: 10,
    marginRight: 10
  },
  title: {
    marginLeft: 5,
    fontSize: 20,
    fontFamily: "nunito-bold",
  },
  subtitle: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "nunito",
  },
  ratingContainer: {
    flexDirection: "row",
    paddingBottom: 5,
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
  },
  buttonType: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#4EA0B7',
    borderRadius: 20,

  },
});
