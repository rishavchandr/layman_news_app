import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import "./global.css"
import RootRouteNavigator from './src/routes/RootRouteNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style = {{flex: 1}}>
       <NavigationContainer>
        <AuthProvider>
          <RootRouteNavigator />
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
