import React, { useEffect, useState } from 'react'
import { View, ScrollView, FlatList, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BASE from "../../config/AXIOS_BASE";
import { t, use } from "i18next";
import Header from "../../components/Header/header";
import { commonStyles } from "../../style";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import API from '../../config/AXIOS_API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const months = [
  { label: 'Tháng 1', value: '01' },
  { label: 'Tháng 2', value: '02' },
  { label: 'Tháng 3', value: '03' },
  { label: 'Tháng 4', value: '04' },
  { label: 'Tháng 5', value: '05' },
  { label: 'Tháng 6', value: '06' },
  { label: 'Tháng 7', value: '07' },
  { label: 'Tháng 8', value: '08' },
  { label: 'Tháng 9', value: '09' },
  { label: 'Tháng 10', value: '10' },
  { label: 'Tháng 11', value: '11' },
  { label: 'Tháng 12', value: '12' },
];

const Booking = () => {
  const { id } = useLocalSearchParams();

  const getDaysInMonth = (month, year) => {
    const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
    const daysArray = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = moment(`${year}-${month}-${i}`, 'YYYY-MM-DD').format('dddd');
      daysArray.push({
        day: i,
        dayOfWeek: dayOfWeek,
        date: moment(`${year}-${month}-${i}`, 'YYYY-MM-DD'),
      });
    }

    return daysArray;
  };

  const router = useRouter();
  const [selectedMonthGui, setSelectedMonthGui] = useState(moment().format('MM'));
  const [selectedMonthTra, setSelectedMonthTra] = useState(moment().format('MM'));
  const [year, setYear] = useState(moment().format('YYYY'));
  const [selectedDayGui, setSelectedDayGui] = useState(null);
  const [selectedDayTra, setSelectedDayTra] = useState(null);
  const today = moment();
  const daysInMonthGui = getDaysInMonth(selectedMonthGui, year);
  const daysInMonthTra = getDaysInMonth(selectedMonthTra, year);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [note, setNote] = useState("");
  const [petId, setPetId] = useState();
  const [roomId, setRoomId] = useState();
  const [serviceIds, setServiceIds] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [petList, setPetList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [signs, setSigns] = useState([]);

  const [userId, setUserId] = useState(null);
  // const fetchUserId = async () => {
  //   try {
  //     userIdT = await AsyncStorage.getItem('userId');
  //     if (userIdT) {
  //       setUserId(Number(userIdT));
  //       console.log('Retrieved userId:', userId);
  //     } else {
  //       console.log('No userId found in AsyncStorage');
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving userId from AsyncStorage:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserId();
  // }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const userIdcc = await AsyncStorage.getItem("userId");
      // const tokencc = await AsyncStorage.getItem('token');
      setUserId(userIdcc);
      // setToken(tokencc);
    };

    fetchUserId();
  }, []);



  const [selectType, setSelectType] = useState();

  const simplePetList = petList.map(pet => ({
    label: pet.name,
    value: pet.id,
  }));
  const simpleSignList = signs.map(sign => ({
    label: sign.name,
    value: sign.sign,
  }));


  const handleSelectServices = (item) => {

    if (selectedServices.includes(item.id)) {
      setSelectedServices((prevSelected) =>
        prevSelected.filter((id) => id !== item.id)
      );
      // setTotalPrice(totalPrice - price);
    } else {
      setSelectedServices((prevSelected) => [...prevSelected, item.id]);
      // console.log(selectedServices);
      // console.log(totalPrice);
      // setTotalPrice(totalPrice + price);
    }
  };



  const isSelectedService = (item) => {
    return selectedServices.includes(item.id);
  };



  const fetchServices = async () => {
    try {
      const response = await API.get(`/services/shops/${id}`);
      // const response = await API.get(`/services/shops/${shopId}`);
      if (response.status===200) {
        setServiceList(response.data.content);
      }
      // console.log("Services:", response.data.content);
    } catch (error) {
      console.error("Error fetching services booking:", error);
    }
  };

  const fetchPets = async () => {
    try {
      // console.log(userId);
      // console.log(userId);
      const response = await API.get(`/pets/users/${userId}`);
      if (response.status===200) {
        setPetList(response.data.content);
      }
      // console.log("Pets:", response.data.content);
    } catch (error) {
      console.error("Error fetching pets booking:", error);
    }
  };


  const fetchRooms = async () => {
    try {
      // const response = await API.get(`/rooms/available/shops/${shopId}`);
      // const response = await API.get(`/rooms/available/shops/1`);
      const response = await API.get(`rooms/available/shops/random-room-by-sign?sign=${selectType}`);
      if (response.status===200) {
        setRooms(response.data);
      }
      // console.log("Rooms:", response.data);
    } catch (error) {
      console.error("Error fetching Rooms booking:", error);
    }
  };


  const fetchSign = async () => {
    try {
      // const response = await API.get(`/rooms/available/shops/${shopId}`);
      const response = await API.get(`/rooms/available/shops/${id}`);
      if (response.status===200) {
        setSigns(response.data);
      }
      console.log("Signs:", response.data);
    } catch (error) {
      console.error("Error fetching Signs booking:", error);
    }
  };




  useEffect(() => {
    const fetchData = async () => {
      if (userId !== null) {
        await fetchServices();
         await fetchPets();
        // await fetchRooms();
        await fetchSign();
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectType) {
        await fetchRooms();
      }
    };

    fetchData();
  }, [selectType]);

  const isBeforeToday = (date) => {
    return date.isBefore(today, 'day');
  };

  const isBeforeDayGui = (date) => {
    return date.isBefore(selectedDayGui, 'day');
  };

  const isSelectedDayGui = (day) => {
    return selectedDayGui && selectedDayGui.isSame(day, 'day');
  };

  const isSelectedDatTra = (day) => {
    return selectedDayTra && selectedDayTra.isSame(day, 'day');
  };



  const handleBooking = () => {
    let error = "";

    if (!selectedDayGui) {
      error = "Bắt buộc nhập ngày gửi";
    } else if (selectedDayTra) {
      if (!selectType) {
        error = "Nếu nhập ngày trả thì bắt buộc chọn roomtype";
      }
    } else if (!petId) {
      error = "Bắt buộc chọn pet";
    } else if (!selectedDayTra && !selectType && !note) {
      error = "Nếu không chọn ngày trả và roomtype thì bắt buộc chọn service";
    }

    if (error) {
      setErrorMessage(error);
      setIsModalVisible(true);
      return;
    }

    const bookingData = {
      startDate: selectedDayGui.format("YYYY-MM-DD"),
      endDate: selectedDayTra ? selectedDayTra.format("YYYY-MM-DD") : '',
      note: note,
      dateBooking: moment(new Date()).format("YYYY-MM-DD HH:mm"),
      roomId: rooms.id,
      petId: petId,
      userId: userId,
      serviceIds: selectedServices,
      totalPrices: rooms.price ? rooms.price : 0
    };
    console.log(bookingData);
    AsyncStorage.setItem('booking', JSON.stringify(bookingData));
    // router.push('/screen/confirmBooking');
    router.push({
      pathname: '/screen/confirmBooking',
      params: { id: id },
    });

  }


  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={"Booking"} />
      <ScrollView style={commonStyles.containerContent}>
        <View style={styles.dateGui}>
          <Text style={styles.dateTitle}>
            {"Ngày gửi"}
          </Text>
          <View style={{
            flex: 1,
            backgroundColor: '#4EA0B7',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            borderColor: '#555',
            borderWidth: 1,
            borderRadius: 15,
            height: 35
          }}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedMonthGui(value)}
              items={months}
              value={selectedMonthGui}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />

          </View>
        </View>
        <View style={styles.rowNgayGui}>
          <FlatList
            data={daysInMonthGui}
            keyExtractor={(item) => item.day.toString()}
            horizontal
            renderItem={({ item }) => {
              const isDisabled = isBeforeToday(item.date);
              const isSelected = isSelectedDayGui(item.date);

              return (
                <TouchableOpacity
                  style={[
                    styles.dayContainer,
                    isDisabled && styles.disabledDay,
                    isSelected && styles.selectedDay,
                  ]}
                  disabled={isDisabled}
                  onPress={() => setSelectedDayGui(item.date)}
                >
                  <Text style={[styles.dayOfWeek, isDisabled && styles.disabledText, isSelected && { color: 'white' }]}>{item.dayOfWeek}</Text>
                  <Text style={[styles.day, isDisabled && styles.disabledText, isSelected && { color: 'white' }]}>{item.day}</Text>
                </TouchableOpacity>
              );
            }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.dateTra}>
          <Text style={styles.dateTitle}>
            {"Ngày trả"}
          </Text>
          <View style={{
            flex: 1,
            backgroundColor: '#4EA0B7',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            borderColor: '#555',
            borderWidth: 1,
            borderRadius: 15,
            height: 35
          }}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedMonthTra(value)}
              items={months}
              value={selectedMonthTra}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />

          </View>
        </View>
        <View style={styles.rowNgayTra}>
          <FlatList
            data={daysInMonthTra}
            keyExtractor={(item) => item.day.toString()}
            horizontal
            renderItem={({ item }) => {
              const isDisabled = isBeforeDayGui(item.date);
              const isSelected = isSelectedDatTra(item.date);

              return (
                <TouchableOpacity
                  style={[
                    styles.dayContainer,
                    isDisabled && styles.disabledDay,
                    isSelected && styles.selectedDay,
                  ]}
                  disabled={isDisabled}
                  onPress={() => setSelectedDayTra(item.date)}
                >
                  <Text style={[styles.dayOfWeek, isDisabled && styles.disabledText, isSelected && { color: 'white' }]}>{item.dayOfWeek}</Text>
                  <Text style={[styles.day, isDisabled && styles.disabledText, isSelected && { color: 'white' }]}>{item.day}</Text>
                </TouchableOpacity>
              );
            }}
            showsHorizontalScrollIndicator={false}
          />

        </View>
        <View style={styles.petSection}>
          <View style={styles.choosePet}>
            <Text style={styles.txtPet}>
              {"Thú cưng"}
            </Text>
            <View
              style={{
                flex: 1,
                backgroundColor: "#4EA0B7",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                borderColor: "#555",
                borderWidth: 1,
                borderRadius: 15,
                height: 35,
                // color:'white'
                // marginHorizontal: 20,
                // paddingRight: 40,
              }}
            >

              <RNPickerSelect
                onValueChange={(value) => setPetId(value)}
                items={simplePetList}
                value={petId}
                style={pickerSelectStyles}
                placeholder={{ label: "Select pet", value: null }}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>

          {/*Room type choose */}
          <View style={styles.choosePet}>
            <Text style={styles.txtPet}>
              {"Loại phòng"}
            </Text>
            <View
              style={{
                flex: 1,
                backgroundColor: "#4EA0B7",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                borderColor: "#555",
                borderWidth: 1,
                borderRadius: 15,
                height: 35,
              }}
            >
              <RNPickerSelect
                onValueChange={(value) => setSelectType(value)}
                items={simpleSignList}
                value={selectType}
                style={pickerSelectStyles}
                placeholder={{ label: "Room type", value: null }}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>


          <View style={styles.row11}>
            <Text style={styles.txtPet}>{"Kèm theo dịch vụ"}</Text>
          </View>

          <View style={{ flexDirection: 'row', margin: 20, }}>
            <FlatList
              data={serviceList}
              keyExtractor={(item) => item.id}
              horizontal
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.dayContainer,
                      { backgroundColor: isSelectedService(item) ? '#4EA0B7' : '#fff' },
                    ]}
                    onPress={() => handleSelectServices(item)}
                  >
                    <Text style={{ color: isSelectedService(item) ? '#fff' : '#000' }}>{item.name}</Text>
                    <Text style={{ color: isSelectedService(item) ? '#fff' : '#000' }}>{item.price}</Text>
                  </TouchableOpacity>
                );
              }}
              showsHorizontalScrollIndicator={false}
            />
          </View>

        </View>
        <TextInput
          style={styles.inputNote}
          placeholder={t("notes")}
          multiline={true}
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
        />


        <View style={commonStyles.mainButtonContainer}>
          <TouchableOpacity onPress={() => handleBooking()} style={commonStyles.mainButton}>
            <Text style={commonStyles.textMainButton}>Xác nhận đặt phòng</Text>
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{errorMessage}</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.buttonClose}
              >
                <Text style={styles.textClose}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  )
}

const pickerSelectStyles = {
  inputAndroid: {
    width: '100%',
    fontSize: 16,
    color: 'white',
  },
  placeholder: {
    color: 'white',
    fontSize: 16,

  }
};

const styles = StyleSheet.create({
  dayContainer: {
    width: 85,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
  disabledDay: {
    backgroundColor: '#d3d3d3',
  },
  selectedDay: {
    backgroundColor: '#4EA0B7',
    color: 'white'
  },
  dayOfWeek: {
    fontSize: 12,
    color: '#7D7D7D',
  },
  day: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#a9a9a9', // Màu chữ xám khi ngày không thể chọn
  },



  petSection: {
    backgroundColor: "#D9D9D969",
    borderRadius: 12,
    paddingTop: 21,
    paddingBottom: 8,
    marginBottom: 28,
    marginHorizontal: 10,
    alignItems: 'center'
    // shadowColor: "#00000040",
    // shadowOpacity: 0.3,
    // shadowOffset: {
    //     width: 0,
    //     height: 4
    // },
    // shadowRadius: 4,
    // elevation: 4,
  },
  dateGui: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginHorizontal: 15,
  },

  rowNgayGui: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 33,
  },
  dateTra: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 15,
  },

  rowNgayTra: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  choosePet: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 12,
  },
  row9: {
    width: 124,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4EA0B7",
    borderRadius: 12,
    paddingVertical: 2,
    paddingLeft: 43,
    paddingRight: 8,
  },
  sizeSection: {
    flexDirection: "row",
    justifyContent: 'space-between', // hoặc 'space-around'
    marginBottom: 17,
    marginHorizontal: 24,
  },
  row11: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
  },
  row12: {
    width: 124,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4EA0B7",
    borderRadius: 12,
    paddingVertical: 2,
    paddingLeft: 33,
    paddingRight: 8,
  },


  dateTitle: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 14,
    flex: 2
  },
  text4: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  textSizeBtn: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
  },

  txtPet: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
    flex: 2,
  },
  text15: {
    color: "#979797",
    fontSize: 16,
  },
  text16: {
    color: "#FDFBF6",
    fontSize: 18,
    fontWeight: "bold",
  },


  btnSize: {
    // flex:1,
    width: 120,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 9,
    // marginRight: 28,
  },

  inputNote: {
    backgroundColor: "#FFFFFF",
    borderColor: "#4EA0B7",
    borderRadius: 8,
    borderWidth: 1,
    paddingBottom: 5,
    paddingHorizontal: 16,
    marginBottom: 28,
    marginHorizontal: 16,
    shadowColor: "#00000040",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 4,
    elevation: 4,

  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#4EA0B7',
    padding: 5,
    borderRadius: 5,
  },
  textClose: {
    color: 'white',
    fontSize: 16
  },

});

export default Booking
