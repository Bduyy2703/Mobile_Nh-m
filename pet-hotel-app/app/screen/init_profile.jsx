import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import API from "../../config/AXIOS_API";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonStyles } from "../../style";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../../components/Header/header";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native";


const InitProfileScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [imageUri, setImageUri] = useState(null);
  const [petType, setPetType] = useState('');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petColor, setPetColor] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petGender, setPetGender] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petTypes, setPetTypes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetchPetTypes();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const userIdcc = await AsyncStorage.getItem("userId");
      const tokencc = await AsyncStorage.getItem('token');
      setUserId(userIdcc);
      setToken(tokencc);
    };

    fetchUserId();
  }, []);

  const fetchPetTypes = async () => {
    try {
      const response = await API.get('/pet-types');
      setPetTypes(response.data);
    } catch (error) {
      console.error('Error fetching pet types:', error);
    }
  };



  const handleAdd = async () => {
    const formData = new FormData();
    formData.append('name', petName);
    formData.append('age', petAge); 
    formData.append('breed', petBreed);
    formData.append('color', petColor);
    formData.append('weight', petWeight);
    formData.append('gender', petGender);
    formData.append('petTypeId', petType);
    formData.append('userId', userId);
    const file = {
      uri: imageUri,
      type: 'image/jpeg', // hoặc image/png, tuỳ thuộc vào loại file
      name: 'pet-image.jpg' // Tên file mà bạn muốn gửi
    };
    
    formData.append('files', file);
      
    try {
      console.log("FormData", formData);
  
      const response = await API.post('/pets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 201) {
        console.log('Pet created:', response.data);
        router.push("/screen/pet");
      } else {
        console.error('Error creating pet:', response.data.message);
      }
    } catch (error) {
      Alert.alert("Kích thước hình ảnh quá lớn");
      console.error('Network error:', error);
    }
  };


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
      <Header title={"Add pet"} />
      <ScrollView style={commonStyles.containerContent}>
        <View style={styles.uploadGroup}>
          <TouchableOpacity onPress={requestPermission} style={styles.avatarContainer}>
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
        </View>

        <Text style={styles.header}>{t("petName")}</Text>
        <TextInput style={commonStyles.input} placeholder={t("petName")} value={petName} onChangeText={setPetName} />

        <Text style={styles.header}>{t("petBreed")}</Text>
        <TextInput style={commonStyles.input} placeholder={t("petBreed")} value={petBreed} onChangeText={setPetBreed} />

        <Text style={styles.header}>{t("colourPet")}</Text>
        <TextInput style={commonStyles.input} placeholder={t("colourPet")} value={petColor} onChangeText={setPetColor} />

        <Text style={styles.header}>{t("petType")}</Text>
        <View style={commonStyles.input}>
          <Picker selectedValue={petType} onValueChange={(itemValue) => setPetType(itemValue)} style={{ height: 50, width: '100%' }}>
            <Picker.Item label={t("selectPetType")} value="" />
            {/* {petTypes.map((type) => ( */}
            {petTypes.length > 0 && petTypes.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.header}>{t("petWeight")}</Text>
        <TextInput style={commonStyles.input} placeholder={t("petWeight")} keyboardType="numeric" value={petWeight} onChangeText={setPetWeight} />

        <Text style={styles.header}>{t("gender")}</Text>
        <TextInput style={commonStyles.input} placeholder={t("gender")} value={petGender} onChangeText={setPetGender} />

        <Text style={styles.header}>{t("agePet")}</Text>
        <TextInput style={commonStyles.input} placeholder={t("agePet")} keyboardType="numeric" value={petAge} onChangeText={setPetAge} />

        <View style={[commonStyles.mainButtonContainer, {marginBottom:50}]}>
          <TouchableOpacity onPress={() => handleAdd()} style={commonStyles.mainButton}>
            <Text style={commonStyles.textMainButton}>ADD PET</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  uploadGroup: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 75,
  },
  header: {
    fontFamily: "nunito-medium",
    color: "#4EA0B7",
    fontSize: 17,
    paddingBottom: 5,
  },
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
    width: 400,
    height: 300,
    borderRadius: 75,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
  },
});

export default InitProfileScreen;
