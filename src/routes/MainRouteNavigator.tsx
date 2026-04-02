import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainTabRouteNavigator from './MainTabRouteNavigator'

const Stack = createNativeStackNavigator()

const MainRouteNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='MainTab' component={MainTabRouteNavigator}/>
    </Stack.Navigator>
  )
}

export default MainRouteNavigator