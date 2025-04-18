import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { commonStyles } from '../../style';

export const PasswordInput = ({placeholder, onPasswordChange}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const handlePasswordChange = (value) => {
    setPassword(value);          
    onPasswordChange(value);     
  };
  return (
    <View style={{ position: 'relative' }}>
      <TextInput
        style={commonStyles.input}
        placeholder={placeholder}
        secureTextEntry={!passwordVisible} 
        placeholderTextColor={'#8BBCE5'}
        value={password}             
        onChangeText={handlePasswordChange}
      />
      <TouchableOpacity
        onPress={() => setPasswordVisible(!passwordVisible)}
        style={{
          position: 'absolute',
          right: 15,
          top: 15,
        }}
      >
        <Ionicons
          name={passwordVisible ? 'eye-off' : 'eye'} 
          size={24}
          color="#416FAE"
        />
      </TouchableOpacity>
    </View>
  );
};
