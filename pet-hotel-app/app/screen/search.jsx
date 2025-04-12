import React from 'react'
import { View } from 'react-native'
import Header from '../../components/Search/Header'
import Parts from '../../components/Search/Parts'
import { commonStyles } from '../../style'
import { SafeAreaView } from "react-native-safe-area-context";

const search = () => {
  return (
    <SafeAreaView style={commonStyles.container}>
        <Header />
        <Parts /> 
    </SafeAreaView>
  )
}

export default search
