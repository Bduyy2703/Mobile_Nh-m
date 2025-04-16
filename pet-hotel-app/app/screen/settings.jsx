import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../config/AXIOS_API';
import { commonStyles } from '../../style';
import Header from '../../components/Header/header';
import ToggleFlag from '../../components/ToggleButtonLanguage/ToggleButton';

const SettingsScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);

  // Chuyển hướng đến các màn hình
  const handleProfile = () => {
    router.push('/screen/profile');
  };

  const handlePet = () => {
    router.push('/screen/pet');
  };

  const handleChangePassword = () => {
    router.push('/screen/changePassword');
  };

  const handlePremium = () => {
    router.push('/screen/premium');
  };

  const handleHistory = () => {
    router.push('/screen/schedule');
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    setLoading(true);
    try {
      // Gọi API logout
      await API.post('/no-auth/logout');
      
      // Xóa dữ liệu trong AsyncStorage
      await AsyncStorage.multiRemove(['userId', 'fullName', 'token']);
      
      // Chuyển hướng về màn hình đăng nhập
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
          {/* Phần Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{t('personalInfo')}</Text>

            <TouchableOpacity onPress={handleProfile} style={styles.item}>
              <View style={styles.iconContainer}>
                <Text>👤</Text>
              </View>
              <Text style={styles.itemText}>{t('editProfile')}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePet} style={styles.item}>
              <View style={styles.iconContainer}>
                <Text>🐾</Text>
              </View>
              <Text style={styles.itemText}>{t('petManagement')}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleChangePassword} style={styles.item}>
              <View style={styles.iconContainer}>
                <Text>🔒</Text>
              </View>
              <Text style={styles.itemText}>{t('changePassword')}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.item}>
              <View style={styles.iconContainer}>
                <Text>🌐</Text>
              </View>
              <Text style={styles.itemText}>{t('language')}</Text>
              <ToggleFlag />
            </View>

            <TouchableOpacity style={styles.item} onPress={handleLogout}>
              <View style={styles.iconContainer}>
                <Text>🚪</Text>
              </View>
              <Text style={styles.itemText}>{t('signout')}</Text>
            </TouchableOpacity>
          </View>

          {/* Phần Other */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{t('other')}</Text>

            <TouchableOpacity style={styles.item} onPress={handlePremium}>
              <View style={styles.iconContainer}>
                <Text>💳</Text>
              </View>
              <Text style={styles.itemText}>{t('upgradeAccount')}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleHistory}>
              <View style={styles.iconContainer}>
                <Text>⏳</Text>
              </View>
              <Text style={styles.itemText}>{t('history')}</Text>
              <Text style={styles.arrow}>›</Text>
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
  },
  arrow: {
    fontSize: 18,
    color: '#4EA0B7',
  },
  iconContainer: {
    marginRight: 10,
    width: 24,
    alignItems: 'center',
  },
});

export default SettingsScreen;