import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/unAuth/SplashScreen';
import Welcome from '../screens/unAuth/Welcome';
import SignUp from '../screens/unAuth/SignUp';
import Login from '../screens/unAuth/Login';

const AuthStack = createNativeStackNavigator();

export default function UnAuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ title: 'SplashScreen' }}
      />
      <AuthStack.Screen
        name="Welcome"
        component={Welcome}
        options={{ title: 'Welcome' }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUp}
        options={{ title: 'SignUp' }}
      />
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login' }}
      />
    </AuthStack.Navigator>
  );
}
