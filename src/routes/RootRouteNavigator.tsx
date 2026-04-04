import React from 'react'
import AuthRouteNavigator from './AuthRouteNavigator'
import MainRouteNavigator from './MainRouteNavigator'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '../context/AuthContext'
import { View , Text } from 'react-native'


const Stack =createNativeStackNavigator()

const RootRouteNavigator = () => {
   const {session , isLoading} = useAuth()
   if(isLoading){
      return (
         <View>
            <Text>isLoading</Text>
         </View>
      )
   }
  return (
     <Stack.Navigator screenOptions={{headerShown: false}}>
        {session ? (
        <Stack.Screen  name = 'Article' component={MainRouteNavigator}/>
        ) : (
         <Stack.Screen name='AuthStack' component={AuthRouteNavigator}/>
        )}
     </Stack.Navigator>
  )
}

export default RootRouteNavigator