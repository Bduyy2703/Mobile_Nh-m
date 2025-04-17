import React, { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BASE from '../../config/AXIOS_BASE';
import API from '../../config/AXIOS_API';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header/header';
import { commonStyles } from '../../style';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
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
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();

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

  const [selectedMonthGui, setSelectedMonthGui] = useState(moment().format('MM'));
  const [selectedMonthTra, setSelectedMonthTra] = useState(moment().format('MM'));
  const [year, setYear] = useState(moment().format('YYYY'));
  const [selectedDayGui, setSelectedDayGui] = useState(null);
  const [selectedDayTra, setSelectedDayTra] = useState(null);
  const today = moment();
  const daysInMonthGui = getDaysInMonth(selectedMonthGui, year);
  const daysInMonthTra = getDaysInMonth(selectedMonthTra, year);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [note, setNote] = useState('');
  const [petId, setPetId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [serviceIds, setServiceIds] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [petList, setPetList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [signs, setSigns] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectType, setSelectType] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setUserId(Number(userId));
        } else {
          Alert.alert(t('error'), t('userNotFound'));
        }
      } catch (error) {
        console.error('Error retrieving userId:', error);
        Alert.alert(t('error'), t('fetchUserIdFailed'));
      }
    };
    fetchUserId();
  }, []);

  const simplePetList = petList.map((pet) => ({
    label: pet.name,
    value: pet.id,
  }));
  const simpleSignList = signs.map((sign) => ({
    label: sign.name,
    value: sign.sign,
  }));

  const handleSelectServices = (item) => {
    if (selectedServices.includes(item.id)) {
      setSelectedServices((prev) => prev.filter((id) => id !== item.id));
      setTotalPrice((prev) => prev - item.price);
    } else {
      setSelectedServices((prev) => [...prev, item.id]);
      setTotalPrice((prev) => prev + item.price);
    }
  };

  const isSelectedService = (item) => selectedServices.includes(item.id);

  const fetchServices = async () => {
    try {
      const response = await API.get(`/services/shops/${id}`);
      if (response.status === 200) {
        setServiceList(response.data.content);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert(t('error'), t('fetchServicesFailed'));
    }
  };

  const fetchPets = async () => {
    try {
      const response = await API.get(`/pets/users/${userId}`);
      if (response.status === 200) {
        setPetList(response.data.content);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      Alert.alert(t('error'), t('fetchPetsFailed'));
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await API.get(`rooms/available/shops/random-room-by-sign?sign=${selectType}`);
      if (response.status === 200) {
        setRooms(response.data);
        setRoomId(response.data.id);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      Alert.alert(t('error'), t('fetchRoomsFailed'));
    }
  };

  const fetchSign = async () => {
    try {
      const response = await API.get(`/rooms/available/shops/${id}`);
      if (response.status === 200) {
        setSigns(response.data);
      }
    } catch (error) {
      console.error('Error fetching signs:', error);
      Alert.alert(t('error'), t('fetchSignsFailed'));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId !== null) {
        await Promise.all([fetchServices(), fetchPets(), fetchSign()]);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (selectType) {
      fetchRooms();
    }
  }, [selectType]);

  const isBeforeToday = (date) => date.isBefore(today, 'day');
  const isBeforeDayGui = (date) => date.isBefore(selectedDayGui, 'day');
  const isSelectedDayGui = (day) => selectedDayGui && selectedDayGui.isSame(day, 'day');
  const isSelectedDayTra = (day) => selectedDayTra && selectedDayTra.isSame(day, 'day');

  const handleBooking = async () => {
    let error = '';

    if (!selectedDayGui) {
      error = t('errorStartDateRequired');
    } else if (selectedDayTra && !selectType) {
      error = t('errorRoomTypeRequired');
    } else if (!petId) {
      error = t('errorPetRequired');
    } else if (!selectedDayTra && !selectType && selectedServices.length === 0) {
      error = t('errorServiceRequired');
    }

    if (error) {
      setErrorMessage(error);
      setIsModalVisible(true);
      return;
    }

    const bookingData = {
      startDate: selectedDayGui.format('YYYY-MM-DD'),
      endDate: selectedDayTra ? selectedDayTra.format('YYYY-MM-DD') : '',
      note: note,
      dateBooking: moment().format('YYYY-MM-DD HH:mm'),
      roomId: roomId,
      petId: petId,
      userId: userId,
      serviceIds: selectedServices,
      totalPrices: totalPrice + (rooms.price || 0),
    };

    try {
      await AsyncStorage.setItem('booking', JSON.stringify(bookingData));
      router.push({
        pathname: '/screen/confirmBooking',
        params: { id: id },
      });
    } catch (error) {
      console.error('Error saving booking data:', error);
      Alert.alert(t('error'), t('saveBookingFailed'));
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t('booking')} />
      <ScrollView style={commonStyles.containerContent}>
        <View style={styles.dateGui}>
          <Text style={styles.dateTitle}>{t('startDate')}</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedMonthGui(value)}
              items={months.map((month) => ({ ...month, label: t(month.label) }))}
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
                  style={[styles.dayContainer, isDisabled && styles.disabledDay, isSelected && styles.selectedDay]}
                  disabled={isDisabled}
                  onPress={() => setSelectedDayGui(item.date)}
                >
                  <Text style={[styles.dayOfWeek, isDisabled && styles.disabledText, isSelected && { color: 'white' }]}>
                    {t(item.dayOfWeek)}
                  </Text>
                  <Text style={[styles.day, isDisabled && styles.disabledText, isSelected && { color: 'white' }]}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.dateTra}>
          <Text style={styles.dateTitle}>{t('endDate')}</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedMonthTra(value)}
              items={months.map((month) => ({ ...month, label: t(month.label) }))}
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
              const isSelected = isSelectedDayTra(item.date);
              return (
                <TouchableOpacity
                  style={[styles.dayContainer, isDisabled && styles.disabledDay, isSelected && styles.selectedDay]}
                  disabled={isDisabled}
                  onPress={() => setSelectedDayTra(item.date)}
                >
                  <Text style={[styles.dayOfWeek, isDisabled && styles.disabledText, isSelected && { color: 'white' }]}>
                    {t(item.dayOfWeek)}
                  </Text>
                  <Text style={[styles.day, isDisabled && styles.disabledText, isSelected && { color: 'white' }]}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.petSection}>
          <View style={styles.choosePet}>
            <Text style={styles.txtPet}>{t('pet')}</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setPetId(value)}
                items={simplePetList}
                value={petId}
                style={pickerSelectStyles}
                placeholder={{ label: t('selectPet'), value: null }}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>
          <View style={styles.choosePet}>
            <Text style={styles.txtPet}>{t('roomType')}</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setSelectType(value)}
                items={simpleSignList}
                value={selectType}
                style={pickerSelectStyles}
                placeholder={{ label: t('selectRoomType'), value: null }}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>
          <View style={styles.row11}>
            <Text style={styles.txtPet}>{t('additionalServices')}</Text>
          </View>
          <View style={styles.servicesContainer}>
            <FlatList
              data={serviceList}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3} // Hiển thị 4 dịch vụ trên mỗi hàng
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.serviceItem,
                    { backgroundColor: isSelectedService(item) ? '#4EA0B7' : '#fff' },
                  ]}
                  onPress={() => handleSelectServices(item)}
                >
                  <Text
                    style={[
                      styles.serviceText,
                      { color: isSelectedService(item) ? '#fff' : '#000' },
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.servicePrice,
                      { color: isSelectedService(item) ? '#fff' : '#000' },
                    ]}
                  >
                    {formatPrice(item.price)} VND
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.serviceList}
            />
          </View>
        </View>
        <TextInput
          style={styles.inputNote}
          placeholder={t('notes')}
          multiline={true}
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
        />
        <View style={commonStyles.mainButtonContainer}>
          <TouchableOpacity onPress={handleBooking} style={commonStyles.mainButton}>
            <Text style={commonStyles.textMainButton}>{t('confirmBooking')}</Text>
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
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.buttonClose}>
                <Text style={styles.textClose}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const pickerSelectStyles = {
  inputAndroid: {
    width: '100%',
    fontSize: 16,
    color: 'white',
  },
  placeholder: {
    color: 'white',
    fontSize: 16,
  },
};

const styles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    backgroundColor: '#4EA0B7',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 15,
    height: 35,
  },
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
    color: '#a9a9a9',
  },
  petSection: {
    backgroundColor: '#D9D9D969',
    borderRadius: 12,
    paddingTop: 21,
    paddingBottom: 8,
    marginBottom: 28,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  dateGui: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Căn giữa theo chiều dọc
    marginBottom: 15,
    marginHorizontal: 15,
  },
  rowNgayGui: {
    marginBottom: 33,
    marginHorizontal: 15,
  },
  dateTra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Căn giữa theo chiều dọc
    marginBottom: 15,
    marginHorizontal: 15,
  },
  rowNgayTra: {
    marginBottom: 28,
    marginHorizontal: 15,
  },
  choosePet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 12,
  },
  row11: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 14,
  },
  dateTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 2,
  },
  txtPet: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
    flex: 2,
  },
  servicesContainer: {
    marginHorizontal: 14,
    marginBottom: 12,
  },
  serviceList: {
    justifyContent: 'space-between', // Đảm bảo các item phân bố đều
  },
  serviceItem: {
    width: '30%', // Chia đều cho 4 cột (100% / 4 - khoảng cách)
    paddingVertical: 10,
    paddingHorizontal: 5,
    margin: '1.5%', // Khoảng cách giữa các item
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  servicePrice: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  inputNote: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4EA0B7',
    borderRadius: 8,
    borderWidth: 1,
    paddingBottom: 5,
    paddingHorizontal: 16,
    marginBottom: 28,
    marginHorizontal: 16,
    shadowColor: '#00000040',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
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
    fontSize: 16,
  },
});

export default Booking;