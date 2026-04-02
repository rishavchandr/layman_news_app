import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/AuthScreens/LoginScreen'
import SignUpScreen from '../screens/AuthScreens/SignUpScreen'
import WelcomeScreen from '../screens/WelcomeScreen'

export type AuthStackParamList = {
    WelcomeScreen: undefined,
    LoginScreen: undefined,
    SignUpScreen: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthRouteNavigator = () => {
  return (
        <Stack.Navigator 
        screenOptions={{headerShown:false}}>
          <Stack.Screen 
           name = 'WelcomeScreen' 
           component={WelcomeScreen}
           />
          <Stack.Screen 
             name='LoginScreen'
             component={LoginScreen}
           />
           <Stack.Screen 
             name='SignUpScreen'
             component={SignUpScreen}
           />
        </Stack.Navigator>
  )
}

export default AuthRouteNavigator