import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
// import { useRoute } from "@react-navigation/native";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import RNPickerSelect from "react-native-picker-select";
import Ionicons from "@expo/vector-icons/Ionicons";
import { commonStyles } from '../../style';
import API from "../../config/AXIOS_API";
import { useRouter } from 'expo-router';

export default function SearchResult() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);

  // Function to fetch localities (provinces)
  // const fetchProvinces = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Token: "d6e3dccb-6289-11ea-8b85-c60e4edfe802",
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     const provinceList = data.data.map((province) => ({
  //       label: province.ProvinceName,
  //       value: province.ProvinceID,
  //     }));
  //     setProvinces(provinceList);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching provinces:", error);
  //     setLoading(false);
  //   }
  // };

  // Call fetchProvinces when the user clicks on "Locality"
  const handleLocalityPress = () => {
    if (provinces.length === 0) {
      fetchProvinces();
    }
  };

  const handleDetails = (id) => {
    router.push({
      pathname: '/screen/details',
      params: { id: id },
    });  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/shops');
        if (response.status === 200) {
          // console.log("fetch success", response.data);
          setData(response.data.content);
        }
      } catch (error) {
        console.error("Error search result", error);
      }
    }

    fetchData();
  }, [])

  return (
    <View style={commonStyles.container}>
      {/* <View style={styles.rowContainer}>
        <View style={styles.rowItem}>
          <Text style={styles.rowItemText}>
            Sort <FontAwesome name="sort" size={15} color="black" />
          </Text>
        </View>

        <TouchableOpacity style={styles.rowItem} onPress={handleLocalityPress}>
          <Text style={styles.rowItemText}>
            Locality{" "}
            <MaterialIcons name="arrow-drop-down" size={20} color="black" />
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          provinces.length > 0 && (
            <RNPickerSelect
              onValueChange={(value) => setSelectedProvince(value)}
              items={provinces}
              style={pickerSelectStyles}
              placeholder={{
                label: "Select locality",
                value: null,
                color: "#9EA0A4",
              }}
            />
          )
        )}

        <View style={styles.rowItem}>
          <Text style={styles.rowItemText}>Price</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedPrice(value)}
            items={[
              { label: "300.000 VND - 500.000 VND", value: "300000-500000" },
              { label: "500.000 VND - 700.000 VND", value: "500000-700000" },
              { label: "700.000 VND - 1.000.000 VND", value: "700000-1000000" },
            ]}
            style={pickerSelectStyles}
            placeholder={{
              label: "Select price range",
              value: null,
              color: "#9EA0A4",
            }}
          />
        </View>

        <View style={styles.rowItem}>
          <Text style={styles.rowItemText}>Kg</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedWeight(value)}
            items={[
              { label: "Small (0-5 kg)", value: "0-5" },
              { label: "Medium (5-15 kg)", value: "5-15" },
              { label: "Large (15-30 kg)", value: "15-30" },
              { label: "Extra Large (30+ kg)", value: "30+" },
            ]}
            style={pickerSelectStyles}
            placeholder={{
              label: "Select weight range",
              value: null,
              color: "#9EA0A4",
            }}
          />
        </View>
      </View> */}

      {/* {selectedPrice && (
        <Text style={styles.selectedText}>
          Selected Price Range: {selectedPrice}
        </Text>
      )}
      {selectedWeight && (
        <Text style={styles.selectedText}>
          Selected Weight Range: {selectedWeight} kg
        </Text>
      )}
      {selectedProvince && (
        <Text style={styles.selectedText}>
          Selected Locality: {selectedProvince}
        </Text>
      )} */}

      <ScrollView style={{ marginTop: 20 }}>
        {data.map((hotel) => (
          <TouchableOpacity key={hotel.id} onPress={() => handleDetails(hotel.id)}>
            <View  style={scrollStyles.container}>
              <View style={scrollStyles.imageContainer}>
                <Image
                  source={require("./../../assets/images/hotel.jpg")}
                  style={scrollStyles.image}
                />
              </View>
              {/* 
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {[...Array(5)].map((_, starIndex) => (
                  <Ionicons
                    key={starIndex}
                    name="star"
                    size={15}
                    color={starIndex < 4 ? "gold" : "black"}
                  />
                ))}
                <Text style={scrollStyles.text}>4.0 (20 Reviewers)</Text>
              </View>
            </View> */}

              <Text style={scrollStyles.title}>{hotel.name || 'Hotel 1'}</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                <Ionicons name="location" size={20} color="black" />
                <Text style={scrollStyles.text}>{hotel.address || 'District 9, HCMC'}</Text>
              </View>

              {/* <Text style={scrollStyles.text}>{hotel.price || '300.000 VND'}</Text> */}
            </View>
          </TouchableOpacity>

        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: "bold",
    color: "#4EA0B7",
    fontFamily: "nunito-bold",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    color: "#4EA0B7",
    fontFamily: "nunito",
  },
  rowContainer: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  rowItem: {
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    flexGrow: 1,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  rowItemText: {
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
    fontFamily: "nunito",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    fontFamily: "nunito",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    fontFamily: "nunito",
  },
});

const scrollStyles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderColor: "#DADADA",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 130,
    borderRadius: 4,
    resizeMode: "cover",
  },
  text: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginTop: 5,
    fontFamily: "nunito",

  },
  title: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginTop: 5,
    fontFamily: "nunito-bold",
  }
});
