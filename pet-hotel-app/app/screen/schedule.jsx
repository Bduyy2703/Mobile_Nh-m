import React, { useEffect, useState } from 'react'
import { View, ScrollView, FlatList, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { router, useRouter } from "expo-router";
import BASE from "../../config/AXIOS_BASE";
import { t, use } from "i18next";
import Header from "../../components/Header/header";
import { commonStyles } from "../../style";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import API from '../../config/AXIOS_API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color } from 'react-native-elements/dist/helpers';

const Schedule = () => {
    return (
        <SafeAreaView style={commonStyles.container}>
            <Header title={"Theo dõi lịch"} />
        </SafeAreaView>
    )
}

export default Schedule