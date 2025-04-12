import { View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SettingsScreen from '../screen/settings';

const TabIcon = ({ iconName, color }) => (
    <View style={{
        width: 60, 
        height: 60,
        borderRadius: 30,
        backgroundColor: color ? '#5EB0DB' : 'transparent', // Màu nền nếu tab được chọn
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <Ionicons name={iconName} size={30} color={color ? 'white' : 'black'} />
    </View>
);

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    height: 50,
                    justifyContent: 'center',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: '#5EB0DB',
                tabBarInactiveTintColor: '#B0BEC5',
            }}
        >

            <Tabs.Screen
                name='home'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon iconName="home" color={focused} />,
                    tabBarLabel: () => null,
                }}
            />
            <Tabs.Screen
                name='pets'
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: focused ? '#5EB0DB' : 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <MaterialIcons name="pets" size={30} color={focused ? 'white' : 'black'} />
                        </View>
                    ),
                    tabBarLabel: () => null,
                }}
            />

            <Tabs.Screen
                name='schedule'
                options={{
                    title: 'Calendar',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon iconName="calendar" color={focused} />,
                    tabBarLabel: () => null,

                }}
            />
            <Tabs.Screen
                name='chat'
                options={{
                    title: 'Chat',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon iconName="chatbubble-ellipses-outline" color={focused} />,
                    tabBarLabel: () => null,
                }}
            />
            <Tabs.Screen
                name='settings'
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        <View style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: focused ? '#5EB0DB' : 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <FontAwesome5 name="user" size={30} color={focused ? 'white' : 'black'} />
                        </View>,
                    tabBarLabel: () => null,

                }}
            />
        </Tabs>
    );
}
