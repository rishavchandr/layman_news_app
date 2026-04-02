import React from 'react'
import AuthRouteNavigator from './AuthRouteNavigator'
import MainRouteNavigator from './MainRouteNavigator'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack =createNativeStackNavigator()

const RootRouteNavigator = () => {
   const isAuthenticated = false;
  return (
     <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
        <Stack.Screen  name = 'MainTab' component={MainRouteNavigator}/>
        ) : (
         <Stack.Screen name='AuthStack' component={AuthRouteNavigator}/>
        )}
     </Stack.Navigator>
  )
}

export default RootRouteNavigator