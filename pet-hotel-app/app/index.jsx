import { View, Text, Image, Pressable } from 'react-native'
import React, { useCallback } from 'react'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { router } from 'expo-router'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../style';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
  const navigation = useNavigation();

  const handleLogin = () => {
    router.push('screen/login');
  }


  

  return (
    <SafeAreaView style={
      // [commonStyles.container, {paddingTop:-50, backgroundColor :'#EDF8FD'}]
      {
        backgroundColor: '#EDF8FD',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop: 50
      }
    }>
      <Text style={{
        margin: 25,
        fontSize: 28,
        textAlign: 'center',
        // marginTop: 60,
        flex: 1,
        color: '#3070B3',
        fontFamily: 'nunito-bold',
      }}>
        Chào mừng đến với <Text style={{ fontSize: 35 }}>ApeHome!</Text>
      </Text>

      {/* <Text style={{ fontSize: 35, textAlign: 'center', color: '#3070B3', fontFamily: 'nunito-bold', }}>ApeHome!</Text> */}
      <View style={{ width: '80%', flex:6, alignItems: 'center' }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{ width:400, height:400}}
          resizeMode="contain"
        />
        <Text style={{
          fontSize: 20,
          fontWeight:'bold',
          marginLeft: 15,
          marginRight: 15,
          // padding: 30,
          fontFamily: 'nunito',
          // color: '#4EA0B7',
          color: '#416FAE',
          textAlign: 'center',
          // }}>Where all of your pets’ needs are right here!</Text>
        }}>Nơi đáp ứng mọi nhu cầu cho thú cưng của bạn!</Text>
      </View>


      <View style={{ flex: 2 }}>
        <Pressable onPress={() => router.push('/screen/signup')} style={{
          padding: 13,
          marginTop: 40,
          backgroundColor: '#416FAE',
          borderRadius: 50,
          width: 300,
        }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#fff',
            fontFamily: 'nunito-bold',
          }}>Tạo tài khoản</Text>
        </Pressable>
        <Pressable onPress={handleLogin} style={{
          padding: 13,
          marginTop: 10,
          borderWidth:1,
          borderColor:'#416FAE',
          // backgroundColor: '#416FAE',
          borderRadius: 50,
          width: 300,
        }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#416FAE',
            fontFamily: 'nunito-bold',
          }}>Đăng nhập</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  )
}