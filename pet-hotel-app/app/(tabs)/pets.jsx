import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import API from '../../config/AXIOS_API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles } from '../../style';

const Pets = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState(null);
  const [open, setOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const petOptions = pets.map(pet => ({
    label: pet.name,
    value: pet.id,
  }));

  const selectedPetInfo = pets.find(pet => pet.id === selectedPet);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchPetData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await API.get(`/pets/users/${userId}`);
        if (response.status === 200) {
          const fetchedPets = response.data.content;
          setPets(fetchedPets);
          if (fetchedPets.length > 0) {
            setSelectedPet(fetchedPets[0].id);
          }
        }
      } catch (error) {
        console.error('Fetch pet data failed:', error);
        Alert.alert(t('error'), t('fetchPetsFailed'));
      } finally {
        setLoading(false);
      }
    };
    fetchPetData();
  }, [userId]);

  const addPet = () => {
    router.push('/screen/init_profile');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4EA0B7" />
        </View>
      ) : (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedPetInfo?.imageFile?.[0]?.url || 'https://i.imgur.com/1tMFzp8.png' }}
              resizeMode={'stretch'}
              style={styles.petImage}
            />
            <View style={styles.topButton}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Icon name="arrow-back-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <View>
                <DropDownPicker
                  open={open}
                  value={selectedPet}
                  items={petOptions}
                  setOpen={setOpen}
                  setValue={setSelectedPet}
                  setItems={setPets}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  placeholder={t('selectPet')}
                  zIndex={1000}
                  textStyle={styles.dropdownText}
                  arrowIconStyle={{ display: 'none' }}
                />
              </View>
              <TouchableOpacity style={styles.plusButton} onPress={addPet}>
                <Icon name="add-outline" size={24} color="#fff" />
                <Text style={styles.plusButtonText}>{t('addPet')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.petInfoContainer}>
            {pets.length === 0 ? (
              <Text style={styles.noPetsText}>{t('noPets')}</Text>
            ) : (
              <>
                <Text style={styles.petName}>{selectedPetInfo?.name || 'N/A'}</Text>
                <Text style={styles.petDetails}>{selectedPetInfo?.breed || 'N/A'}</Text>
                <View style={styles.infoCardsContainer}>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardLabel}>{t('weight')}</Text>
                    <Text style={styles.infoCardValue}>{selectedPetInfo?.weight ? `${selectedPetInfo.weight} Kg` : 'N/A'}</Text>
                  </View>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardLabel}>{t('age')}</Text>
                    <Text style={styles.infoCardValue}>{selectedPetInfo?.age || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardLabel}>{t('color')}</Text>
                    <Text style={styles.infoCardValue}>{selectedPetInfo?.color || 'N/A'}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: '45%',
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topButton: {
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 20,
  },
  dropdown: {
    width: 200,
    height: 'auto',
    borderColor: '#ccc',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    justifyContent: 'center',
    width: 200,
    borderColor: '#ccc',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    maxHeight: 120,
  },
  dropdownText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
  plusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 20,
  },
  plusButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  petInfoContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flex: 1,
  },
  noPetsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  petName: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'nunito-bold',
  },
  petDetails: {
    color: '#888',
    marginVertical: 5,
    fontSize: 18,
    fontFamily: 'nunito-medium',
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: '#F0F6FD',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  infoCardLabel: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'nunito-medium',
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    fontFamily: 'nunito-bold',
  },
});

export default Pets;