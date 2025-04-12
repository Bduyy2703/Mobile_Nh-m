import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Sliders from '../../components/Home/Sliders'
import SubHeader from '../../components/Home/SubHeader'
import { commonStyles } from '../../style'

export default function Home() {
  return (
    <View style={commonStyles.container}>
      <Header />
      <SubHeader />
      {/* <Sliders /> */}
    </View>
  )
}