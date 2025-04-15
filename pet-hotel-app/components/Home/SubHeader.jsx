import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import BackgroundImange from './../../assets/images/background.png';
import HomeIcon from './../../assets/images/home.png';
import VaccineIcon from './../../assets/images/vaccine.png';
import MedicalIcon from './../../assets/images/medical.png';
import CutIcon from './../../assets/images/cut.png';

const SubHeader = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [id, setId] = useState(1);
  const handleJoinNow = () => {
    console.log("Join Now clicked!");
  };

  const handleBooking = async () => {
    router.push('/screen/details');
  }

  const handleSearchClick = () => {
    router.push('/screen/search');
  };

  return (
    <View style={styles.subHeaderContainer}>
      <View style={styles.rectangle}>
        <Image
          source={BackgroundImange}
          style={styles.image}
        />
        {/* <View style={styles.overlayContainer}>
          <Text style={styles.communityTitle}>Join The Community</Text>
          <TouchableOpacity onPress={handleJoinNow} style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Now</Text>
          </TouchableOpacity>
        </View> */}
      </View>

      <View style={styles.serviceTitleContainer}>
        <Text style={styles.serviceTitle}>{t("service", "Dịch vụ")}</Text>
      </View>

      <View style={styles.servicesContainer}>
        <ServiceButton title="Khách sạn" icon={HomeIcon} />
        <ServiceButton title="Spa & Grooming" icon={CutIcon} />
        <ServiceButton title="Thú y" icon={MedicalIcon} />
        <ServiceButton title="Tiêm ngừa" icon={VaccineIcon} />
      </View>
      <TouchableOpacity onPress={handleSearchClick} style={styles.searchContainer}>
        <TextInput
          placeholder="Tìm kiếm cửa hàng"
          style={styles.searchInput}
          editable={false} 
        />
      </TouchableOpacity>
      <View style={styles.serviceTitleContainer}>
        <Text style={styles.serviceTitle}>{t("recommend", "Gợi ý")}</Text>
      </View>
      <View style={styles.shopSection}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
            resizeMode={'stretch'}
            imageStyle={styles.view3}
            style={styles.view2}
          />
        </View>

        <View style={styles.column}>
          <View style={styles.row3}>
            <View style={styles.view4}>
              <Text style={styles.text3}>
                {"10% Off"}
              </Text>
            </View>
            <Text style={styles.text7}>
              {"4.8"}
            </Text>
          </View>
          <Text style={styles.text4}>
            {"KATYB PET CARE"}
          </Text>
          <View style={styles.row4}>
            <Image
              source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
              resizeMode={"stretch"}
              style={styles.image6}
            />
            <Text style={styles.text5}>
              {"Quận 9"}
            </Text>
          </View>
          <Text style={styles.text6}>
            {"150.000VND/Ngày"}
          </Text>
        </View>

      </View>
    </View>
  );
};

const ServiceButton = ({ title, onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.serviceButton} onPress={onPress}>
      <View style={styles.serviceIcon}>
        <Image style={{ width: 40, height: 40 }} source={icon} />
      </View>
      <Text style={styles.serviceText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SubHeader;

const styles = StyleSheet.create({
  subHeaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 20,
  },
  rectangle: {
    backgroundColor: "#F4A261",
    borderRadius: 20,
    width: "90%",
    height: 200,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  searchContainer: {
    width: '80%',
    margin: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 1.0,
    backgroundColor:'#fff',
    borderRadius: 30,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: "110%",
    position: "absolute", 
    top: 0,
    left: 0,
    borderRadius: 20,
  },
  overlayContainer: {
    position: "absolute", 
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  communityTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  joinButtonText: {
    color: "#F4A261",
    fontWeight: "bold",
  },
  serviceTitleContainer: {
    width: "90%",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 18,
    color: "#333",
    fontFamily: "nunito-bold",
  },
  servicesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 10,
  },
  serviceButton: {
    alignItems: "center",
    width: 70,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#ddd",
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 30,
    alignItems: 'center',
  },
  serviceText: {
    marginTop: 8,
    textAlign: "center",
    color: "#333",
  },

  shopSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 73,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 10,
    elevation: 4,
  },
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  row4: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },
  text3: {
    color: "#4EA0B7",
    fontSize: 12,
    fontWeight: "bold",
  },
  text4: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 7,
    marginLeft: 1,
  },
  text5: {
    color: "#AEACAC",
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
  },
  text6: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  text7: {
    color: "#4EA0B7",
    fontSize: 12,
    fontWeight: "bold",
  },
  view4: {
    width: 43,
    alignItems: "center",
    backgroundColor: "#FFF5F0",
    borderRadius: 2,
    paddingVertical: 5,
  },
  view2: {
    width: 127,
    height: 108,
    paddingLeft: 92,
    paddingRight: 5,
    marginRight: 17,
  },
  view3: {
    borderRadius: 15,
  },
  image6: {
    width: 11,
    height: 16,
    marginRight: 8,
  },
  column: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
