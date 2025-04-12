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
import {commonStyles} from "../../style";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure you have this imported


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

  useEffect(() => {
    fetchPetTypes();
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
    const petData = {
      name: petName,
      age: parseFloat(petAge),
      breed: petBreed,
      color: petColor,
      weight: parseFloat(petWeight),
      gender: petGender,
      petTypeId: petType, // Here you use the selected pet type ID
      userId: 1, // Adjust user ID as necessary
    };

    try {
      const token = await AsyncStorage.getItem('token');
      if(!token) {
        console.error('No token found');
        return;
      }

      const response = await API.post('/pets', petData, {
        headers: {
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
      console.error('Network error:', error);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.containerContent}>
        <View style={styles.uploadGroup}>
          <TouchableOpacity onPress={() => {/* Handle image upload */}}>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.image} />
            )}
            {!imageUri && <Image source={require("./../../assets/images/icons8-camera-50.png")} />}
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
            {petTypes.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.id} /> // Assuming type has id and name
            ))}
          </Picker>
        </View>

        <Text style={styles.header}>{t("petWeight")}</Text>
        <TextInput style={commonStyles.input} placeholder={t("petWeight")} keyboardType="numeric" value={petWeight} onChangeText={setPetWeight} />

        <Text style={styles.header}>{t("gender")}</Text>
        <TextInput style={commonStyles.input} placeholder={t("gender")} value={petGender} onChangeText={setPetGender} />

        <Text style={styles.header}>{t("agePet")}</Text>
        <TextInput style={commonStyles.input} placeholder={t("agePet")} keyboardType="numeric" value={petAge} onChangeText={setPetAge} />

        <View style={commonStyles.mainButtonContainer}>
          <TouchableOpacity onPress={handleAdd} style={commonStyles.mainButton}>
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
});

export default InitProfileScreen;
