import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/MainTabScreens/HomeScreen'
import SavedScreen from '../screens/MainTabScreens/SavedScreen'
import ProfileScreen from '../screens/MainTabScreens/ProfileScreen'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'


export type MainTabParamList = {
    HomeScreen: undefined,
    SavedScreen: undefined,
    ProfileScreen: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()

const MainTabRouteNavigator = () => {
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarActiveTintColor : "#2C2721ff",
        headerShown: false
      }}
    >
        <Tab.Screen 
          name='HomeScreen'
          component={HomeScreen}
          options={{
            tabBarIcon: ({color} : {color: string}) => (
               <FontAwesome6 
                 name='house'
                 color={color}
                 size={28}
                 iconStyle='solid'
               />
            )
          }}
        />
        <Tab.Screen 
          name='SavedScreen'
          component={SavedScreen}
          options={{
            tabBarIcon: ({color} : {color: string}) => (
               <FontAwesome6 
                 name='bookmark'
                 color={color}
                 size={28}
                 iconStyle='regular'
               />
            )
          }}
        />
        <Tab.Screen 
          name='ProfileScreen'
          component={ProfileScreen}
          options={{
            tabBarIcon: ({color} : {color: string}) => (
               <FontAwesome6 
                 name='circle-user'
                 color={color}
                 size={28}
                 iconStyle='solid'
               />
            )
          }}
        />
    </Tab.Navigator>
  )
}

export default MainTabRouteNavigator