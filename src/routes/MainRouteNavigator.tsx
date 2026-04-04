import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainTabRouteNavigator from './MainTabRouteNavigator'
import { NewsArticle } from '../api/NewsService';
import ArticleDetailsScreen from '../screens/ArticleDetailsScreen';
import AskLaymans from '../screens/AskLaymans';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator()

export type RootStackParamList = {
  MainTabs: undefined;
  ArticleDetails: { article: NewsArticle };
  AskLayman: { article: NewsArticle };
  SearchScreen: undefined
};

const MainRouteNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='MainTabs' component={MainTabRouteNavigator}/>
        <Stack.Screen
          name="ArticleDetails"
          component={ArticleDetailsScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="AskLayman"
          component={AskLaymans}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: [0.5, 0.75, 1],
            sheetInitialDetentIndex: 1
          }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ animation: 'slide_from_right' }}
        />
    </Stack.Navigator>
  )
}

export default MainRouteNavigator