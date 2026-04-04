import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/MainTabScreens/HomeScreen'
import SavedScreen from '../screens/MainTabScreens/SavedScreen'
import ProfileScreen from '../screens/MainTabScreens/ProfileScreen'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'


export type MainTabParamList = {
    Home: undefined,
    Saved: undefined,
    Profile: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()

const MainTabRouteNavigator = () => {
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarActiveTintColor: '#E8572A',
        tabBarInactiveTintColor: '#A67C5B',
        headerShown: false
      }}
    >
        <Tab.Screen 
          name='Home'
          component={HomeScreen}
          options={{
            tabBarIcon: ({color} : {color: string}) => (
               <FontAwesome6 
                 name="house"
                 color={color}
                 size={28}
                 iconStyle={"solid"}
               />
            )
          }}
        />
        <Tab.Screen 
          name='Saved'
          component={SavedScreen}
          options={{
            tabBarIcon: ({color} : {color: string}) => (
               <FontAwesome6 
                 name="bookmark"
                 color={color}
                 size={28}
                 iconStyle={"solid"}
               />
            )
          }}
        />
        <Tab.Screen 
          name='Profile'
          component={ProfileScreen}
          options={{
            tabBarIcon: ({color} : {color: string}) => (
               <FontAwesome6 
                 name="circle-user"
                 color={color}
                 size={28}
                 iconStyle={"solid"}
               />
            )
          }}
        />
    </Tab.Navigator>
  )
}

export default MainTabRouteNavigator