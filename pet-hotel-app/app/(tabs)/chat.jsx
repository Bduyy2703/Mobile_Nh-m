import { View, Text } from 'react-native'
import React from 'react'
import MessageScreen from './../../components/Message/messages'
import { commonStyles } from "./../../style";

export default function Pet() {
  return (
    <View style={commonStyles.container}>
      <MessageScreen/>
    </View>
  )
}