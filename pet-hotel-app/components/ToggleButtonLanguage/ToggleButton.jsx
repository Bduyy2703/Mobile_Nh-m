import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../../i18n';

const ToggleFlag = () => {
  const [isVnFlag, setIsVnFlag] = useState(i18n.language === 'vi'); // Khởi tạo dựa trên ngôn ngữ hiện tại

  const toggleSwitch = () => {
    const newLang = isVnFlag ? 'en' : 'vi'; // Dựa trên trạng thái cờ để đổi ngôn ngữ
    i18n.changeLanguage(newLang);
    setIsVnFlag(!isVnFlag);
  };

  useEffect(() => {
    // Đồng bộ trạng thái cờ với ngôn ngữ hiện tại
    setIsVnFlag(i18n.language === 'vi');
  }, [i18n.language]);

  return (
    <TouchableOpacity onPress={toggleSwitch} style={styles.switchContainer}>
      <View style={[styles.toggle, isVnFlag ? styles.toggleLeft : styles.toggleRight]}>
        <Image
          source={
            isVnFlag
              ? require('../../assets/images/icons8-vietnam-48.png')
              : require('../../assets/images/icons8-english-48.png')
          }
          style={styles.flag}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 70,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#D6EDF7',
    justifyContent: 'center',
    padding: 5,
  },
  toggle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  toggleLeft: {
    alignSelf: 'flex-start',
  },
  toggleRight: {
    alignSelf: 'flex-end',
  },
  flag: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default ToggleFlag;