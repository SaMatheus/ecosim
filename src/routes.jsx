import React from 'react'
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home, Login } from './screens';

const Routes = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
          <Stack.Screen  name='Login' component={Login} />
          <Stack.Screen  name='Home' component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}

export default Routes;
