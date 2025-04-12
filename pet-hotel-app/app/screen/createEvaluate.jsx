import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { commonStyles } from '../../style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import Header from './../../components/Header/header'
import { Rating } from 'react-native-ratings';
import { MaterialIcons } from '@expo/vector-icons';

const EvaluateScreen = () => {
    const router = useRouter();
    const handleUpdate = () => {
        // router.push('/');
    };
    const { t, i18n } = useTranslation();


    return (
        <SafeAreaView style={commonStyles.container}>
            <Header title={t('submitReview')} />
            <View style={commonStyles.containerContent}>
                <Rating
                    style={{ margin: 20, marginBottom:10 }}
                    imageSize={45}
                    startingValue={4.5}
                    ratingColor="#FFD700"
                    ratingBackgroundColor="#CCCCCC" />
                <Text style={styles.subText}>How do you feel about this experience?</Text>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.uploadButton}>
                        <MaterialIcons name="camera-alt" size={40} color="#4EA0B7" style={styles.cameraIcon} />
                        <Text style={{ color: '#000' }}>Select image</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.fastCommemtContainer}>
                    <TouchableOpacity style={styles.fastCommemt}>
                        <Text>Product quality is very good</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.fastCommemt}>
                        <Text>Enthusiastic advice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.fastCommemt}>
                        <Text>The shop service is very good</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.fastCommemt}>
                        <Text style={styles.textFastCommemt}>Affordable price</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.fastCommemt}>
                        <Text style={styles.textFastCommemt}>I will come back next time</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.subText, { textAlign: 'left' }]}>Share your experience with everyone</Text>
                <TextInput
                    style={{
                        height: 80,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 20,
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginBottom: 15,
                        backgroundColor: '#fff',
                        textAlignVertical: 'top',
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        shadowOffset: { width: 0, height: 1 },
                        elevation: 5,
                    }}
                    placeholder="Add commemt"
                    multiline={true}
                    numberOfLines={4}
                />




                <View style={commonStyles.mainButtonContainer}>
                    <TouchableOpacity onPress={handleUpdate} style={commonStyles.mainButton}>
                        <Text style={commonStyles.textMainButton}>{t('update')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    uploadButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4EA0B7',
        borderRadius: 20,
        width: '40%',
        alignItems: 'center',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 1 },
        elevation: 5,
        marginBottom: 20
    },
    subText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 15,
        marginBottom: 15
    },
    fastCommemtContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,

    },
    fastCommemt: {
        borderWidth: 1,
        borderColor: '#4EA0B7',
        borderRadius: 20,
        alignSelf: 'flex-start',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 1 },
        elevation: 5,
        backgroundColor: '#fff',

    },
    textFastCommemt: {
        fontSize: 16,
        color: 'black',
    }

});

export default EvaluateScreen;
