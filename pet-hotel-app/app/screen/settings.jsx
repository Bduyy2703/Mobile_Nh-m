import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router'; 
import { commonStyles } from '../../style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import Header from './../../components/Header/header'
import ToggleFlag from '../../components/ToggleButtonLanguage/ToggleButton';

const SettingsScreen = () => {
  const router = useRouter();
  const handleProfile =() => {
    router.push('/screen/profile');
  }
  const handlePet =() => {
    router.push('/screen/pet');
  }
  const handleChangePassword =()=>{
    router.push('screen/changePassword');
  }
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  return (
    <SafeAreaView style={commonStyles.container}>
    <Header title={t('setting')}/>
    <View style={commonStyles.containerContent} >
      <View style={styles.section}>
        {/* <Text style={styles.sectionHeader}>Personal information</Text> */}
                <Text style={styles.sectionHeader}>{t('personalInfo')}</Text>

        <TouchableOpacity onPress={handleProfile} style={styles.item}>
          <Text style={styles.itemText}>{t('editProfile')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePet} style={styles.item}>
          <Text style={styles.itemText}>{t('petManagement')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleChangePassword} style={styles.item}>
          <Text style={styles.itemText}>{t('changePassword')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.item}>
          <Text style={styles.itemText}>{t('language')}</Text>
          <ToggleFlag/>
        </View>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>{t('signout')}</Text>
          {/* <Text style={styles.arrow}>›</Text> */}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>{t('other')}</Text>

        <TouchableOpacity style={styles.item}>
          {/* <View style={styles.iconContainer}>
            <Text>💳</Text>
          </View> */}
          <Text style={styles.itemText}>{t('paymentMethod')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          {/* <View style={styles.iconContainer}>
            <Text>⏳</Text>
          </View> */}
          <Text style={styles.itemText}>{t('history')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDF7F2',
  },
  header: {
    fontSize: 28,
    color: '#4EA0B7',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#96C4D6',
    padding: 10,
    borderRadius: 8,
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingLeft:20,
  },
  itemText: {
    fontSize: 16,
    color: '#4EA0B7',
  },
  arrow: {
    fontSize: 18,
    color: '#4EA0B7',
  },
  flag: {
    width: 30,
    height: 20,
    borderRadius: 4,
  },
  iconContainer: {
    marginRight: 10,
  },
});

export default SettingsScreen;
