import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';

import BusinessProfileSetup from '../screens/auth/business/businessProfileSetup';
import PurposeSelection from '../screens/auth/purposeSelection';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AuthStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="PurposeSelection" component={PurposeSelection} />
      <AuthStack.Screen
        name="BusinessProfileSetup"
        component={BusinessProfileSetup}
      />
      <AuthStack.Screen name="Home" component={Home} />
      <AuthStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
    </AuthStack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen name="Home" component={Home} />
    </BottomTab.Navigator>
  );
}
