import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header/header";
import { commonStyles } from "../../style";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter , useLocalSearchParams  } from "expo-router";
import ChatIcon from "./../../assets/images/chat.png";
import CallIcon from "./../../assets/images/call.png";
import API from "../../config/AXIOS_API";

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log("shop",id);
  const [shopData, setShopData] = useState({
    name: "",
    address: "",
    description: "",
  });
  const [serviceData, setServiceData] = useState([]);
  // const id = 1;

  const fetchShopData = async () => {
    try {
      const response = await API.get(`/shops/${id}`);
      setShopData(response.data);
      console.log("Shop data:", response.data);
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  };

  const fetchService = async () => {
    try {
      const response = await API.get(`/services/shops/${id}`);
      setServiceData(response.data.content);
      console.log("Service data:", response.data.content);
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };
  useEffect(() => {
    fetchShopData();
    fetchService();
  }, []);

  const handleBooking = () => {
    // router.push("/screen/booking");
    router.push({
      pathname: '/screen/booking',
      params: { id: id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ImageBackground
          source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
          resizeMode={"stretch"}
          imageStyle={styles.column2}
          style={styles.column}
        >
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={styles.shopName}>
          <View style={styles.column3}>
            <Text style={styles.text2}>
              {shopData.name} {/* call name */}
            </Text>
            <View style={styles.row5}>
              <Text style={styles.text3}>
                {shopData.address} {/* call address */}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#4EA0B7",
              borderRadius: 20,
              width: 35,
              height: 35,
              alignItems: "center",
            }}
          >
            <Image
              source={ChatIcon}
              resizeMode={"stretch"}
              style={styles.image8}
            />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#4EA0B7",
              borderRadius: 20,
              width: 35,
              height: 35,
              alignItems: "center",
            }}
          >
            <Image
              source={CallIcon}
              resizeMode={"stretch"}
              style={styles.image9}
            />
          </View>
        </View>
        <View style={styles.row6}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text4}>{"4.0"}</Text>
          </View>
          <View style={styles.view2}>
            <Text style={styles.text4}>+200 nhận xét</Text>
          </View>
        </View>
        <Text style={styles.text5}>{"Mô tả"}</Text>
        <Text style={styles.text6}>
          {shopData.description} {/* call description */}
        </Text>
        <Text style={styles.text7}>{"Các dịch vụ khác"}</Text>
        {serviceData.length > 0 ? (
          serviceData.map((service, index) => (
            <Text key={index} style={styles.text8}>
              {service.name}{" "}
              {/* Adjust this property name based on your API response */}
            </Text>
          ))
        ) : (
          <Text style={styles.text8}>{"No services available"}</Text>
        )}
      </ScrollView>
      <View>
        <View style={styles.row7}>
          <View style={styles.column5}>
            <Text style={styles.text9}>{"Tổng giá"}</Text>
            <Text style={styles.text10}>{"160.000VND /Ngày"}</Text>
          </View>

          <TouchableOpacity onPress={handleBooking} style={styles.view3}>
            <Text style={styles.text11}>{"Đặt ngay"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  absoluteBox: {
    position: "absolute",
    bottom: -2,
    right: 115,
    width: 151,
    height: 10,
    backgroundColor: "#C3D7DD",
    borderRadius: 10,
  },
  box: {
    height: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: 1,
    marginTop: 2,
  },
  box2: {
    width: 1,
    height: 4,
    backgroundColor: "#FFFFFF",
  },
  box3: {
    flex: 1,
    alignSelf: "stretch",
  },
  column: {
    height: 387,
    paddingVertical: 18,
    marginBottom: 35,
  },
  column2: {
    borderRadius: 15,
  },
  column3: {
    flex: 8,
    marginRight: 4,
  },
  column4: {
    flex: 1,
  },
  column5: {
    flex: 1,
    alignSelf: "flex-start",
    marginTop: 7,
    marginRight: 4,
  },
  image: {
    width: 17,
    height: 10,
    marginRight: 5,
  },
  image2: {
    width: 15,
    height: 11,
    marginRight: 6,
  },
  image3: {
    width: 30,
    height: 30,
  },
  image4: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  image5: {
    width: 13,
    height: 13,
  },
  image6: {
    width: 5,
    height: 7,
    marginRight: 9,
  },
  image7: {
    width: 33,
    height: 33,
    marginRight: 14,
  },
  image8: {
    width: 30,
    height: 30,
    // marginRight: 13,
  },
  image9: {
    width: 30,
    height: 30,
  },
  image10: {
    width: 15,
    height: 14,
    marginRight: 7,
  },
  image11: {
    width: 23,
    height: 23,
  },
  image12: {
    height: 23,
    marginHorizontal: 11,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 29,
    marginHorizontal: 15,
  },
  row2: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 267,
    marginHorizontal: 27,
  },
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 148,
  },
  shopName: {
    flexDirection: "row",
    // justifyContent: 'space-evenly',
    gap: 5,
    alignItems: "center",
    marginBottom: 13,
    marginHorizontal: 16,
  },
  row5: {
    flexDirection: "row",
    alignItems: "center",
  },
  row6: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3EFFC",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 17,
    marginHorizontal: 39,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  row7: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    // borderColor: "#000",
    // borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 21,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 15,
    marginRight: 4,
    flex: 1,
  },
  text2: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 1,
  },
  text3: {
    color: "#7F7F7F",
    fontSize: 12,
    flex: 1,
  },
  text4: {
    color: "#5399BD",
    fontSize: 14,
    fontWeight: "bold",
  },
  text5: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 20,
  },
  text6: {
    color: "#7F7F7F",
    fontSize: 15,
    marginBottom: 16,
    marginHorizontal: 18,
    width: 354,
  },
  text7: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 7,
    marginLeft: 17,
  },
  text8: {
    color: "#7F7F7F",
    fontSize: 16,
    marginBottom: 8,
    marginHorizontal: 25,
    width: 340,
  },
  text9: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    marginLeft: 3,
  },
  text10: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  text11: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  view: {
    width: 22,
    borderColor: "#FFFFFF",
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: 2,
    marginRight: 1,
  },
  view2: {
    flex: 1,
    alignItems: "flex-end",
  },
  view3: {
    width: 160,
    alignSelf: "flex-start",
    alignItems: "center",
    backgroundColor: "#4EA0B7",
    borderRadius: 30,
    paddingVertical: 18,
  },
});
export default Details;
