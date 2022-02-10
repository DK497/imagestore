import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/screens/Login';
import Shop from './components/screens/Shop';
import ImageScreen from './components/screens/ImageScreen';
import { NativeBaseProvider } from 'native-base';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NativeBaseProvider>
 <NavigationContainer>
      <Stack.Navigator 
      screenOptions={{
      headerShown: false
  }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Shops" component={Shop} />
        <Stack.Screen name="Images" component={ImageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </NativeBaseProvider>
   
  );
}

export default App;