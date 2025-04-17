import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { commonStyles } from "../../style";
import { useRouter, useFocusEffect } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import API from '../../config/AXIOS_API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from "react-i18next";

const Pet = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [token, setToken] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [open, setOpen] = useState(false);
    const [pets, setPets] = useState([]);
    const petOptions = pets.map(pet => ({
        label: pet.name,
        value: pet.id
    }));
    const selectedPetInfo = pets.find(pet => pet.id === selectedPet) || {};

    const petImageUrl = selectedPetInfo.imageFile?.length > 0
        ? selectedPetInfo.imageFile[0].url
        : "https://i.imgur.com/1tMFzp8.png";

    console.log("Pet image URL:", petImageUrl);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const userIdcc = await AsyncStorage.getItem("userId");
            const tokencc = await AsyncStorage.getItem('token');
            if (!userIdcc || !tokencc) {
                Alert.alert(t("error"), t("notLoggedIn"));
                router.push("/login");
                return;
            }
            setUserId(userIdcc);
            setToken(tokencc);
        };

        fetchUserId();
    }, []);

    const fetchPetData = async () => {
        try {
            console.log("Fetching pets for userId:", userId);
            const response = await API.get(`/pets/users/${userId}`);
            console.log("Fetch pet response status:", response.status);
            console.log("Fetch pet response data:", response.data);
            if (response.status === 200) {
                const petsData = response.data.content;
                setPets(petsData);
                console.log("Fetched pets data:", petsData);
                if (petsData.length > 0) {
                    setSelectedPet(petsData[0].id);
                } else {
                    setSelectedPet(null);
                }
            }
        } catch (error) {
            console.error('Fetch pet data failed:', error);
            Alert.alert(t("error"), t("fetchPetDataFailed"));
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                fetchPetData();
            }
        }, [userId])
    );

    const handleEdit = () => {
        if (!selectedPetInfo.id) {
            Alert.alert(t("error"), t("noPetSelected"));
            return;
        }
        router.push({
            pathname: 'screen/updatePet',
            params: {
                id: selectedPetInfo.id,
                name: selectedPetInfo.name,
                breed: selectedPetInfo.breed,
                color: selectedPetInfo.color,
                gender: selectedPetInfo.gender,
                petTypeId: selectedPetInfo.petTypeId,
                weight: selectedPetInfo.weight,
                age: selectedPetInfo.age,
                imageUrl: selectedPetInfo.imageFile?.length > 0 ? selectedPetInfo.imageFile[0].url : '',
            }
        });
    };

    const handleDelete = async () => {
        console.log("Delete button pressed");
        console.log("Selected pet:", selectedPetInfo);

        if (!selectedPetInfo.id) {
            Alert.alert(t("error"), t("noPetSelected"));
            return;
        }

        if (!token) {
            Alert.alert(t("error"), t("notLoggedIn"));
            router.push("/login");
            return;
        }

        console.log("Token before API call:", token);
        console.log("Showing Alert.alert for confirmation");

        // Tạm thời bỏ Alert.alert để gọi API trực tiếp (debug)
        try {
            console.log("Deleting pet with ID:", selectedPetInfo.id);
            console.log("Using token:", token);
            const response = await API.delete(`/pets/${selectedPetInfo.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Delete response status:", response.status);
            console.log("Delete response data:", response.data);
            if (response.status === 200) {
                Alert.alert(t("success"), t("petDeleted"));
                await fetchPetData();
            }
        } catch (error) {
            console.error('Delete pet failed:', error);
            console.error('Error details:', error.response?.data);
            Alert.alert(t("error"), t("deletePetFailed") + (error.response?.data?.message ? `: ${error.response.data.message}` : ''));
        }

        // Code gốc với Alert.alert (sẽ khôi phục sau khi debug)
        /*
        Alert.alert(
            t("confirmDelete"),
            t("deletePetConfirmation"),
            [
                {
                    text: t("cancel"),
                    style: "cancel"
                },
                {
                    text: t("delete"),
                    onPress: async () => {
                        try {
                            console.log("Deleting pet with ID:", selectedPetInfo.id);
                            console.log("Using token:", token);
                            const response = await API.delete(`/pets/${selectedPetInfo.id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            console.log("Delete response status:", response.status);
                            console.log("Delete response data:", response.data);
                            if (response.status === 200) {
                                Alert.alert(t("success"), t("petDeleted"));
                                await fetchPetData();
                            }
                        } catch (error) {
                            console.error('Delete pet failed:', error);
                            console.error('Error details:', error.response?.data);
                            Alert.alert(t("error"), t("deletePetFailed") + (error.response?.data?.message ? `: ${error.response.data.message}` : ''));
                        }
                    }
                }
            ]
        );
        */
    };

    return (
        <SafeAreaView style={commonStyles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={
                      {  uri:'https://static-00.iconduck.com/assets.00/qr-scan-icon-512x512-9bsp061y.png'}
                        // {
                        //     uri: selectedPetInfo && selectedPetInfo.imageFile && selectedPetInfo.imageFile.length > 0
                        //         ? [...selectedPetInfo.imageFile]
                        //             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.url
                        //         : "https://i.imgur.com/1tMFzp8.png"
                        // }
                    }
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
                            placeholder={t("selectPet")}
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
                        <Text style={styles.petName}>{selectedPetInfo ? selectedPetInfo.name : t("na")}</Text>
                        <Text style={styles.petDetails}>{`${selectedPetInfo ? selectedPetInfo.breed : t("na")}`}</Text>
                    </View>

                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        zIndex: 1,
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
                        <Text style={styles.infoCardLabel}>{t("weight")}</Text>
                        <Text style={styles.infoCardValue}>{selectedPetInfo ? selectedPetInfo.weight + ' Kg' : t("na")}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>{t("age")}</Text>
                        <Text style={styles.infoCardValue}>{selectedPetInfo ? selectedPetInfo.age : t("na")}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardLabel}>{t("color")}</Text>
                        <Text style={styles.infoCardValue}>{selectedPetInfo ? selectedPetInfo.color : t("na")}</Text>
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
    petImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    topButton: {
        width: '100%',
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between'
    },
    backButton: {
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
        fontSize: 18
    },
    plusButton: {
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
    }
});

export default Pet;