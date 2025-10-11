import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../hooks';
import UnAuthNavigator from './unAuth';
import AuthNavigator from './auth';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="UnAuthNavigator" component={UnAuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
