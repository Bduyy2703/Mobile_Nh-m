import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
const ToggleFlag = () => {
  const [isVnFlag, setIsVnFlag] = useState(null);

  const toggleSwitch = () => {
    setIsVnFlag(!isVnFlag);
    if(i18n.language==='en'){
        i18n.changeLanguage('vi')
    }else{
        i18n.changeLanguage('en')
    }
  };

  useEffect(() => {
    if (i18n.language === 'en') {
      setIsVnFlag(false);
    } else {
      setIsVnFlag(true);
    }
  }, [i18n.language]);

  return (
      <TouchableOpacity onPress={toggleSwitch} style={styles.switchContainer}>
        <View style={[styles.toggle, isVnFlag ? styles.toggleLeft : styles.toggleRight]}>
          <Image
            source={
              isVnFlag
                ? require('./../../assets/images/icons8-vietnam-48.png') 
                : require('./../../assets/images/icons8-english-48.png') 
            }
            style={styles.flag}
          />
        </View>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    width: 70,
    height: 30,
    borderRadius: 20,
    // backgroundColor: '#cfd8dc',
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
