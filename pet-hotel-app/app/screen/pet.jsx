import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { commonStyles } from "../../style";
import { useRouter, useFocusEffect } from 'expo-router'; // Import useFocusEffect
import DropDownPicker from 'react-native-dropdown-picker';
import API from '../../config/AXIOS_API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const Pet = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [selectedPet, setSelectedPet] = useState('');
    const [open, setOpen] = useState(false);
    const [pets, setPets] = useState([]);
    const petOptions = pets.map(pet => ({
        label: pet.name,
        value: pet.id
    }));
    const selectedPetInfo = pets.find(pet => pet.id === selectedPet) || {};

    // Use optional chaining to safely access properties
    const petImageUrl = selectedPetInfo.imageFile?.length > 0
        ? selectedPetInfo.imageFile[0].url
        : "https://i.imgur.com/1tMFzp8.png"; // Default image

    console.log("Pet image URL:", petImageUrl);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const userIdcc = await AsyncStorage.getItem("userId");
            const tokencc = await AsyncStorage.getItem('token');
            setUserId(userIdcc);
            setToken(tokencc);
        };

        fetchUserId();
    }, []);

    // Function to fetch pet data
    const fetchPetData = async () => {
        try {
            const response = await API.get(`/pets/users/${userId}`);
            if (response.status === 200) {
                const petsData = response.data.content;
                setPets(petsData);
                console.log("Fetched pets data:", petsData); // Log the fetched data
                if (petsData.length > 0) {
                    setSelectedPet(petsData[0].id); // Set to the first pet's ID
                }
            }
        } catch (error) {
            console.error('Fetch pet data failed:', error);
        }
    };

    // Use useFocusEffect to fetch pet data whenever the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                fetchPetData();
            }
        }, [userId])
    );

    const handleEdit = () => {
        if (selectedPetInfo) {
            router.push({
                pathname: 'screen/update_pet',
                params: {
                    id: selectedPetInfo.id,
                    name: selectedPetInfo.name,
                    breed: selectedPetInfo.breed,
                    color: selectedPetInfo.color,
                    gender: selectedPetInfo.gender,
                    petTypeId: selectedPetInfo.petTypeId,
                    weight: selectedPetInfo.weight,
                    age: selectedPetInfo.age,
                    imageFile: selectedPetInfo.imageFile[0].url,
                }
            });
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa thú cưng này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            const response = await API.delete(`/pets/${selectedPetInfo.id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            if (response.status === 200) {
                                console.log("deleted");
                                fetchPetData();
                                setSelectedPet(pets.length > 1 ? pets[1].id : '');
                            }
                        } catch (error) {
                            console.error('Delete pet failed:', error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={commonStyles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: selectedPetInfo && selectedPetInfo.imageFile && selectedPetInfo.imageFile.length > 0
                            ? selectedPetInfo.imageFile
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.url
                            : "https://i.imgur.com/1tMFzp8.png" // URL ảnh mặc định
                    }}
                    resizeMode={'stretch'}
                    style={styles.petImage}
                />

                <View style={styles.topButton}>
                    <TouchableOpacity onPress={() => { router.back() }} style={styles.backButton}>
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
                            placeholder="Chọn thú cưng"
                            zIndex={1000}
                            textStyle={styles.dropdownText}
                            arrowIconStyle={{ display: 'none' }}
                        />
                    </View>
                    <TouchableOpacity onPress={() => router.push("/screen/init_profile")} style={styles.plusButton}>
                        <Icon name="add-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.petInfoContainer}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start'
                    }}>
                        <Text style={styles.petName}>{selectedPetInfo ? selectedPetInfo.name : 'NA'}</Text>
                        <Text style={styles.petDetails}>{`${selectedPetInfo ? selectedPetInfo.breed : 'NA'}`}</Text>
                    </View>

                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={handleEdit} style={{ marginLeft: 10 }}>
                            <Icon name="pencil" size={24} color="#000" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleDelete} style={{ marginLeft: 10 }}>
                            <Icon name="trash" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoCardsContainer}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>Cân Nặng</Text>
                        <Text style={styles.infoCardValue}>{selectedPetInfo ? selectedPetInfo.weight + ' Kg' : 'NA'}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>Tuổi</Text>
                        <Text style={styles.infoCardValue}>{selectedPetInfo ? selectedPetInfo.age : 'NA'}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>Màu Sắc</Text>
                        <Text style={styles.infoCardValue}>{selectedPetInfo ? selectedPetInfo.color : 'NA'}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        position: 'relative',
        height: '45%'
    },
    row: {
        paddingTop: 20,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 29,
        marginHorizontal: 15,
    },
    column: {
        height: 387,
        paddingVertical: 18,
        marginBottom: 35,
    },

    petImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },

    topButton: {
        width: '100%',
        position: 'absolute',
        // top: 40,
        // display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between'
        // justifyContent:'center'
    },
    backButton: {
        // position: 'absolute',
        // top: 40,
        // left: 20,
        // flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 10,
        borderRadius: 20
    },
    dropdown: {
        width: 200,
        height: 'auto',
        borderColor: '#ccc',
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderWidth: 1,
        borderRadius: 10, justifyContent: 'center',
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
        fontSize: 18
    },

    plusButton: {
        // position: 'absolute',
        // top: 40,
        // right: 20,
        // flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 10,
        borderRadius: 20
    },
    petInfoContainer: {

        height: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -30,
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    petName: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    petDetails: {
        color: '#888',
        marginVertical: 5,
        fontSize: 18
    },
    infoCardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    infoCard: {
        backgroundColor: '#F0F6FD',
        padding: 15,
        borderRadius: 10,
        width: '30%',
        alignItems: 'center'
    },
    infoCardLabel: {
        fontSize: 12,
        color: '#888'
    },
    infoCardValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5
    },
    tabView: {
        flex: 1,
        backgroundColor: '#fff'
    },
    tabContent: {
        padding: 20,
        // backgroundColor: '#000'

    }


});

export default Pet;
