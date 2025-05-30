import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Modal } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { commonStyles } from '../../style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from './../../components/Header/header'
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/AXIOS_API';

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [gender, setGender] = useState("Male");
  const [imageUri, setImageUri] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [premium, setPremium] = useState('');
  const [userInfo, setUserInfor] = useState();
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);


  useEffect(() => {
    const fetchUserId = async () => {
      const userIdcc = await AsyncStorage.getItem("userId");
      const tokencc = await AsyncStorage.getItem('token');
      setUserId(userIdcc);
      setToken(tokencc);
    };

    fetchUserId();
  }, []);


  const handleUpdate = async () => {
    try {
      let updateData = {
        username: userInfo.username,
        email: email,
        fullName: fullName,
        dob: formattedDate,
        address: address,
        gender: gender,
        phone: phone
      }
      console.log(updateData);
      const response = await API.put(`users/${userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 200) {
        console.log(response.data);
        setErrorMessage("Update successfully");
        setIsModalVisible(true);
      } else {
        console.log("khong duoc");
      }
    } catch (error) {
      console.error('Error update profile', error);
    }
    // router.push('/');
  };


  const fetchData = async () => {
    try {
      const response = await API.get(`users/${userId}`);
      if (response.status === 200) {
        setUserInfor(response.data);
        setFullName(response.data.fullName);
        setAddress(response.data.address);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setFormattedDate(response.data.dob);
        setPremium(response.data.premium);
        console.log("Fetching success info", response.data);
        console.log("Fetching success info");
      }

    } catch (error) {
      console.error("Error fetching us booking:", error);
    }

  };
  // useEffect(() => {

  //   if (userId != null && userId != undefined) {
  //     fetchData();
  //   }
  // }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
        if (userId) {
          fetchData();
        }
    }, [userId])
);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const onChangeDate = (event, selectedDate) => {
    setShow(false);
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      setFormattedDate(formattedDate);
    }
  };



  const showDatePicker = () => {
    setShow(true);
  }


  const requestPermission = async () => {
    try {
      console.log('pressed');

      // const checkPermission = 
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

      setImageUri(result.assets[0].uri);

    } catch (error) {
      console.log('Error requesting permission:', error);
    }
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t('profile')} />
      <ScrollView style={commonStyles.containerContent}>
        {/* <View style={styles.uploadGroup}>
          <TouchableOpacity onPress={requestPermission} style={{ margin: 20 }}>
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={{ width: 150, height: 150, marginBottom: 10, borderRadius: 75 }}
              />

            )}
          </TouchableOpacity> */}
        {/* {imageUri && (
                   <Image
              source={{ uri: imageUri }}
              style={{ width: 150, height: 150, marginBottom: 10, borderRadius: 75 }}
                  />
            
                     )} */}
        {/* {!imageUri && (
            <TouchableOpacity onPress={requestPermission} style={{ margin: 20 }}>
              <Image
                source={
                  require('./../../assets/images/icons8-camera-50.png')
                }
              />
            </TouchableOpacity>
          )}

         
        </View> */}

        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={requestPermission} style={[styles.avatarContainer, premium != null && styles.premiumBorder]}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={require('./../../assets/images/icons8-camera-50.png')}
                style={styles.defaultAvatar}
              />
            )}
          </TouchableOpacity>
          {premium == true && <Text style={styles.premiumBadge}>Premium</Text>}
        </View>
        <Text style={[styles.header, { paddingTop: 20 }]}>
          {t('displayName')}
        </Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.header}>
          Email
        </Text>
        <TextInput
          style={commonStyles.input}
          placeholder="email@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.header}>
          {t('phoneNumber')}
        </Text>
        <TextInput
          style={commonStyles.input}
          placeholder="0373777177"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
        />
        <Text style={styles.header}>
          {t('gender')}
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        <Text style={styles.header}>
          {t('birthday')}
        </Text>
        <View>
          <TouchableOpacity onPress={showDatePicker}>
            <TextInput
              style={[commonStyles.input, styles.dateInput]}
              value={formattedDate}
              editable={false}
            />
          </TouchableOpacity>
        </View>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        <View style={commonStyles.mainButtonContainer}>
          <TouchableOpacity onPress={() => handleUpdate()} style={[commonStyles.mainButton, style = { marginBottom: 100 }]}>
            <Text style={commonStyles.textMainButton}>{t('update')}</Text>
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
                <Text style={styles.textClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  uploadGroup: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    borderRadius: 75,
    padding: 5,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
  },
  // Dành cho tài khoản Premium
  premiumBorder: {
    borderWidth: 2,
    borderColor: '#D4AF37', // Viền vàng kim cho tài khoản Premium
  },
  premiumBadge: {
    backgroundColor: '#D4AF37', // Vàng kim
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 10,
  },

  header: {
    fontFamily: 'nunito-medium',
    color: '#4EA0B7',
    fontSize: 17,
    paddingBottom: 5
  },
  pickerContainer: {
    height: 50,
    borderWidth: 2,
    borderColor: '#416FAE',
    borderRadius: 30,
    marginBottom: 15,
    paddingLeft: 5,
    paddingRight: 20,
    backgroundColor: '#EEF7FD',
    justifyContent: 'center',
  },
  picker: {
    height: '100%',
    width: '100%',
  },
  dateInput: {
    color: '#000',
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

export default ProfileScreen;
