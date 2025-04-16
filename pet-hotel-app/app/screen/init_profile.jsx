// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Platform,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Picker } from "@react-native-picker/picker";
// import API from "../../config/AXIOS_API";
// import { useTranslation } from "react-i18next";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { commonStyles } from "../../style";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Header from "../../components/Header/header";
// import * as ImagePicker from "expo-image-picker";

// const InitProfileScreen = () => {
//   const router = useRouter();
//   const { t } = useTranslation();

//   const [imageUri, setImageUri] = useState(null);
//   const [petType, setPetType] = useState("");
//   const [petName, setPetName] = useState("");
//   const [petBreed, setPetBreed] = useState("");
//   const [petColor, setPetColor] = useState("");
//   const [petWeight, setPetWeight] = useState("");
//   const [petGender, setPetGender] = useState("");
//   const [petAge, setPetAge] = useState("");
//   const [petTypes, setPetTypes] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchPetTypes();
//     fetchUserId();
//   }, []);

//   const fetchUserId = async () => {
//     try {
//       const userIdcc = await AsyncStorage.getItem("userId");
//       const tokencc = await AsyncStorage.getItem("token");
//       if (!userIdcc || !tokencc) {
//         Alert.alert(t("error"), t("notLoggedIn"));
//         router.push("/login");
//         return;
//       }
//       setUserId(userIdcc);
//       setToken(tokencc);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       Alert.alert(t("error"), t("fetchUserDataFailed"));
//     }
//   };

//   const fetchPetTypes = async () => {
//     try {
//       const response = await API.get("/pet-types");
//       if (response.status === 200) {
//         setPetTypes(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching pet types:", error);
//       Alert.alert(t("error"), t("fetchPetTypesFailed"));
//     }
//   };

//   const requestPermission = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(t("error"), t("mediaLibraryPermissionDenied"));
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setImageUri(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.error("Error picking image:", error);
//       Alert.alert(t("error"), t("imagePickFailed"));
//     }
//   };

//   const uriToBlob = async (uri) => {
//     return new Promise((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
//       xhr.onload = function () {
//         resolve(xhr.response);
//       };
//       xhr.onerror = function () {
//         reject(new Error("uriToBlob failed"));
//       };
//       xhr.responseType = "blob";
//       xhr.open("GET", uri, true);
//       xhr.send(null);
//     });
//   };

//   const handleAdd = async () => {
//     if (!petName) {
//       Alert.alert(t("error"), t("nameRequired"));
//       return;
//     }
//     if (!petGender) {
//       Alert.alert(t("error"), t("genderRequired"));
//       return;
//     }
//     if (!petType) {
//       Alert.alert(t("error"), t("petTypeRequired"));
//       return;
//     }
//     if (!petBreed) {
//       Alert.alert(t("error"), t("breedRequired"));
//       return;
//     }
//     if (!petColor) {
//       Alert.alert(t("error"), t("colorRequired"));
//       return;
//     }
//     if (!petWeight || isNaN(petWeight) || Number(petWeight) <= 0) {
//       Alert.alert(t("error"), t("weightMustBePositive"));
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("name", petName);
//     formData.append("age", petAge || "0");
//     formData.append("breed", petBreed);
//     formData.append("color", petColor);
//     formData.append("weight", petWeight);
//     formData.append("gender", petGender);
//     formData.append("petTypeId", petType);

//     if (imageUri) {
//       console.log("Appending image with URI:", imageUri);
//       try {
//         const blob = await uriToBlob(
//           Platform.OS === "android" ? imageUri : imageUri.replace("file://", "")
//         );
//         formData.append("files", blob, `pet_image_${Date.now()}.jpg`);
//       } catch (error) {
//         console.error("Error converting URI to Blob:", error);
//         Alert.alert(t("error"), t("imageConversionFailed"));
//         setLoading(false);
//         return;
//       }
//     } else {
//       console.log("No image selected");
//     }

//     try {
//       console.log("Sending FormData to create pet with fetch");
//       const response = await fetch("http://192.168.50.89:9090/api/v1/pets", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });
//       const result = await response.json();
//       console.log("Response status:", response.status);
//       console.log("Response data:", result);
//       if (response.status === 201) {
//         Alert.alert(t("success"), t("petCreated"));
//         router.push("/screen/pet");
//       } else {
//         console.error("Error creating pet:", result.message);
//         Alert.alert(t("error"), t("createPetFailed"));
//       }
//     } catch (error) {
//       console.error("Network error:", error);
//       Alert.alert(t("error"), error.message || t("createPetFailed"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={commonStyles.container}>
//       <Header title={t("addPet")} />
//       <ScrollView style={commonStyles.containerContent}>
//         <View style={styles.uploadGroup}>
//           <TouchableOpacity onPress={requestPermission} style={styles.avatarContainer}>
//             {imageUri ? (
//               <Image source={{ uri: imageUri }} style={styles.avatar} />
//             ) : (
//               <Image
//                 source={require("./../../assets/images/icons8-camera-50.png")}
//                 style={styles.defaultAvatar}
//               />
//             )}
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.header}>{t("petName")}</Text>
//         <TextInput
//           style={commonStyles.input}
//           placeholder={t("petName")}
//           value={petName}
//           onChangeText={setPetName}
//         />

//         <Text style={styles.header}>{t("petBreed")}</Text>
//         <TextInput
//           style={commonStyles.input}
//           placeholder={t("petBreed")}
//           value={petBreed}
//           onChangeText={setPetBreed}
//         />

//         <Text style={styles.header}>{t("colourPet")}</Text>
//         <TextInput
//           style={commonStyles.input}
//           placeholder={t("colourPet")}
//           value={petColor}
//           onChangeText={setPetColor}
//         />

//         <Text style={styles.header}>{t("petType")}</Text>
//         <View style={commonStyles.input}>
//           <Picker
//             selectedValue={petType}
//             onValueChange={(itemValue) => setPetType(itemValue)}
//             style={{ height: 50, width: "100%" }}
//           >
//             <Picker.Item label={t("selectPetType")} value="" />
//             {petTypes.length > 0 ? (
//               petTypes.map((type) => (
//                 <Picker.Item key={type.id} label={type.name} value={type.id} />
//               ))
//             ) : (
//               <Picker.Item label={t("noPetTypes")} value="" />
//             )}
//           </Picker>
//         </View>

//         <Text style={styles.header}>{t("petWeight")}</Text>
//         <TextInput
//           style={commonStyles.input}
//           placeholder={t("petWeight")}
//           keyboardType="numeric"
//           value={petWeight}
//           onChangeText={setPetWeight}
//         />

//         <Text style={styles.header}>{t("gender")}</Text>
//         <TextInput
//           style={commonStyles.input}
//           placeholder={t("gender")}
//           value={petGender}
//           onChangeText={setPetGender}
//         />

//         <Text style={styles.header}>{t("agePet")}</Text>
//         <TextInput
//           style={commonStyles.input}
//           placeholder={t("agePet")}
//           keyboardType="numeric"
//           value={petAge}
//           onChangeText={setPetAge}
//         />

//         <View style={[commonStyles.mainButtonContainer, { marginBottom: 50 }]}>
//           <TouchableOpacity
//             onPress={handleAdd}
//             style={commonStyles.mainButton}
//             disabled={loading}
//           >
//             <Text style={commonStyles.textMainButton}>
//               {loading ? t("adding") : t("addPet")}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   uploadGroup: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     fontFamily: "nunito-medium",
//     color: "#4EA0B7",
//     fontSize: 17,
//     paddingBottom: 5,
//   },
//   avatarContainer: {
//     borderRadius: 75,
//     padding: 5,
//   },
//   avatar: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//   },
//   defaultAvatar: {
//     width: 100,
//     height: 100,
//   },
// });

// export default InitProfileScreen;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import API from "../../config/AXIOS_API";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonStyles } from "../../style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/Header/header";
import * as ImagePicker from "expo-image-picker";

const InitProfileScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [imageUri, setImageUri] = useState(null);
  const [petType, setPetType] = useState("");
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petColor, setPetColor] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petGender, setPetGender] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petTypes, setPetTypes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPetTypes();
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const userIdcc = await AsyncStorage.getItem("userId");
      const tokencc = await AsyncStorage.getItem("token");
      if (!userIdcc || !tokencc) {
        Alert.alert(t("error"), t("notLoggedIn"));
        router.push("/login");
        return;
      }
      setUserId(userIdcc);
      setToken(tokencc);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert(t("error"), t("fetchUserDataFailed"));
    }
  };

  const fetchPetTypes = async () => {
    try {
      const response = await API.get("/pet-types");
      if (response.status === 200) {
        setPetTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching pet types:", error);
      Alert.alert(t("error"), t("fetchPetTypesFailed"));
    }
  };

  const requestPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("error"), t("mediaLibraryPermissionDenied"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(t("error"), t("imagePickFailed"));
    }
  };

  const uriToBlob = async (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const handleAdd = async () => {
    if (!petName) {
      Alert.alert(t("error"), t("nameRequired"));
      return;
    }
    if (!petGender) {
      Alert.alert(t("error"), t("genderRequired"));
      return;
    }
    if (!petType) {
      Alert.alert(t("error"), t("petTypeRequired"));
      return;
    }
    if (!petBreed) {
      Alert.alert(t("error"), t("breedRequired"));
      return;
    }
    if (!petColor) {
      Alert.alert(t("error"), t("colorRequired"));
      return;
    }
    if (!petWeight || isNaN(petWeight) || Number(petWeight) <= 0) {
      Alert.alert(t("error"), t("weightMustBePositive"));
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", petName);
    formData.append("age", petAge || "0");
    formData.append("breed", petBreed);
    formData.append("color", petColor);
    formData.append("weight", petWeight);
    formData.append("gender", petGender);
    formData.append("petTypeId", petType);

    if (imageUri) {
      console.log("Appending image with URI:", imageUri);
      try {
        const blob = await uriToBlob(
          Platform.OS === "android" ? imageUri : imageUri.replace("file://", "")
        );
        formData.append("files", blob, `pet_image_${Date.now()}.jpg`);
      } catch (error) {
        console.error("Error converting URI to Blob:", error);
        Alert.alert(t("error"), t("imageConversionFailed"));
        setLoading(false);
        return;
      }
    } else {
      console.log("No image selected");
    }

    try {
      console.log("Sending FormData to create pet with fetch");
      const response = await fetch("http://192.168.50.89:9090/api/v1/pets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", result);
      if (response.status === 201) {
        Alert.alert(t("success"), t("petCreated"));
        router.push("/screen/pet");
      } else {
        console.error("Error creating pet:", result.message);
        Alert.alert(t("error"), t("createPetFailed"));
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert(t("error"), error.message || t("createPetFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t("addPet")} />
      <ScrollView style={commonStyles.containerContent}>
        <View style={styles.uploadGroup}>
          <TouchableOpacity onPress={requestPermission} style={styles.avatarContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <Image
                source={require("./../../assets/images/icons8-camera-50.png")}
                style={styles.defaultAvatar}
              />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>{t("petName")}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={t("petName")}
          value={petName}
          onChangeText={setPetName}
        />

        <Text style={styles.header}>{t("petBreed")}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={t("petBreed")}
          value={petBreed}
          onChangeText={setPetBreed}
        />

        <Text style={styles.header}>{t("colourPet")}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={t("colourPet")}
          value={petColor}
          onChangeText={setPetColor}
        />

        <Text style={styles.header}>{t("petType")}</Text>
        <View style={commonStyles.input}>
          <Picker
            selectedValue={petType}
            onValueChange={(itemValue) => setPetType(itemValue)}
            style={{ height: 50, width: "100%" }}
          >
            <Picker.Item label={t("selectPetType")} value="" />
            {petTypes.length > 0 ? (
              petTypes.map((type) => (
                <Picker.Item key={type.id} label={type.name} value={type.id} />
              ))
            ) : (
              <Picker.Item label={t("noPetTypes")} value="" />
            )}
          </Picker>
        </View>

        <Text style={styles.header}>{t("petWeight")}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={t("petWeight")}
          keyboardType="numeric"
          value={petWeight}
          onChangeText={setPetWeight}
        />

        <Text style={styles.header}>{t("gender")}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={t("gender")}
          value={petGender}
          onChangeText={setPetGender}
        />

        <Text style={styles.header}>{t("agePet")}</Text>
        <TextInput
          style={commonStyles.input}
          placeholder={t("agePet")}
          keyboardType="numeric"
          value={petAge}
          onChangeText={setPetAge}
        />

        <View style={[commonStyles.mainButtonContainer, { marginBottom: 50 }]}>
          <TouchableOpacity
            onPress={handleAdd}
            style={commonStyles.mainButton}
            disabled={loading}
          >
            <Text style={commonStyles.textMainButton}>
              {loading ? t("adding") : t("addPet")}
            </Text>
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
  header: {
    fontFamily: "nunito-medium",
    color: "#4EA0B7",
    fontSize: 17,
    paddingBottom: 5,
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
});

export default InitProfileScreen;