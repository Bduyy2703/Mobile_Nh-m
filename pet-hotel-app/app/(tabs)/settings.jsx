import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/AXIOS_API';
import BASE from '../../config/AXIOS_BASE';
import { commonStyles } from '../../style';
import Header from '../../components/Header/header';
import ToggleFlag from '../../components/ToggleButtonLanguage/ToggleButton';

const SettingsScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t('error'), t('notLoggedIn'));
        router.push('/login');
      }
    };
    checkLogin();
  }, []);

  const handleProfile = () => {
    router.push('/screen/profile');
  };

  const handlePet = () => {
    router.push('/screen/pet');
  };

  const handlePremium = () => {
    router.push('/screen/premium');
  };

  const handleHistory = () => {
    router.push('/screen/schedule');
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await BASE.post('/logout');
      await AsyncStorage.multiRemove(['userId', 'fullName', 'token']);
      router.replace('/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      Alert.alert(t('error'), t('logoutFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <Header title={t('setting')} />
      {loading ? (
        <ActivityIndicator size="large" color="#4EA0B7" />
      ) : (
        <View style={commonStyles.containerContent}>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{t('personalInfo')}</Text>
            <TouchableOpacity onPress={handleProfile} style={styles.item}>
              <Ionicons name="person-outline" size={24} color="#4EA0B7" style={styles.iconContainer} />
              <Text style={styles.itemText}>{t('editProfile')}</Text>
              <Ionicons name="chevron-forward" size={18} color="#4EA0B7" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePet} style={styles.item}>
              <Ionicons name="paw-outline" size={24} color="#4EA0B7" style={styles.iconContainer} />
              <Text style={styles.itemText}>{t('petManagement')}</Text>
              <Ionicons name="chevron-forward" size={18} color="#4EA0B7" />
            </TouchableOpacity>
            <View style={styles.item}>
              <Ionicons name="language-outline" size={24} color="#4EA0B7" style={styles.iconContainer} />
              <Text style={styles.itemText}>{t('language')}</Text>
              <ToggleFlag />
            </View>
            <TouchableOpacity style={styles.item} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#4EA0B7" style={styles.iconContainer} />
              <Text style={styles.itemText}>{t('signout')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{t('other')}</Text>
            <TouchableOpacity style={styles.item} onPress={handlePremium}>
              <Ionicons name="card-outline" size={24} color="#4EA0B7" style={styles.iconContainer} />
              <Text style={styles.itemText}>{t('upgradeAccount')}</Text>
              <Ionicons name="chevron-forward" size={18} color="#4EA0B7" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={handleHistory}>
              <Ionicons name="time-outline" size={24} color="#4EA0B7" style={styles.iconContainer} />
              <Text style={styles.itemText}>{t('history')}</Text>
              <Ionicons name="chevron-forward" size={18} color="#4EA0B7" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: 'nunito-bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 16,
    color: '#4EA0B7',
    flex: 1,
    fontFamily: 'nunito-medium',
  },
  iconContainer: {
    marginRight: 10,
  },
});

export default SettingsScreen;