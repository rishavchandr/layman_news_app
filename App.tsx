
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import "./global.css"
import RootRouteNavigator from './src/routes/RootRouteNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function App(): React.JSX.Element {

  return (
    <GestureHandlerRootView style = {{flex: 1}}>
       <NavigationContainer>
       <RootRouteNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
