import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/auth/explorer/Home';
import Discover from '../screens/auth/explorer/Discover';
import Dashboard from '../screens/auth/business/Dashboard';

import BusinessProfileSetup from '../screens/auth/business/BusinessProfileSetup';
import PurposeSelection from '../screens/auth/purposeSelection';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import assets from '../assets';
import { COLORS } from '../constants';
import { hp, wp } from '../utils/responsive';
import StoreDetails from '../screens/auth/explorer/StoreDetails';
import BusinessStoreDetails from '../screens/auth/business/BusinessStoreDetails';
import Profile from '../screens/auth/explorer/Profile';
import Bookmark from '../screens/auth/explorer/Bookmark';
import Shops from '../screens/auth/business/Shops';
import Notifications from '../screens/auth/business/Notifications';
import OwnerProfile from '../screens/auth/business/OwnerProfile';
const AuthStack = createNativeStackNavigator();

const Stack = createNativeStackNavigator();
const ExplorerStack = createBottomTabNavigator();
export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      detachInactiveScreens={true}
    >
      <AuthStack.Screen name="PurposeSelection" component={PurposeSelection} />
      <AuthStack.Screen name="ExplorerHome" component={ExplorerNavigator} />
      <AuthStack.Screen name="Dashboard" component={Dashboard} />
      <AuthStack.Screen name="Shops" component={Shops} />
      <AuthStack.Screen
        name="BusinessStoreDetails"
        component={BusinessStoreDetails}
      />
      <AuthStack.Screen
        name="BusinessProfileSetup"
        component={BusinessProfileSetup}
      />
      <AuthStack.Screen name="Notifications" component={Notifications} />
      <AuthStack.Screen name="OwnerProfile" component={OwnerProfile} />
    </AuthStack.Navigator>
  );
}

function ExplorerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExplorerBottomTabs" component={ExplorerBottomTabs} />
      <Stack.Screen name="StoreDetails" component={StoreDetails} />
    </Stack.Navigator>
  );
}

function ExplorerBottomTabs() {
  return (
    <ExplorerStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
        },
        tabBarBackground: () => null,
        headerShadowVisible: false,
        shadowColor: 'transparent',
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderRadius: hp(20),
          marginBottom: hp(1),
          marginHorizontal: wp(2.5),
          paddingTop: hp(0.5),
          position: 'absolute',
          bottom: 0,
        },
      }}
    >
      <ExplorerStack.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                opacity: focused ? 1 : 0.3,
                color: COLORS.primary,
                fontFamily: 'Poppins-Regular',
                marginTop: hp(0.5),
              }}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={assets.homeIconPrimary}
                resizeMode="contain"
                style={{
                  width: size - 3,
                  height: size - 3,
                  opacity: focused ? 1 : 0.3,
                }}
              />
            );
          },
        }}
      />
      <ExplorerStack.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                opacity: focused ? 1 : 0.3,
                color: COLORS.primary,
                fontFamily: 'Poppins-Regular',
                marginTop: hp(0.5),
              }}
            >
              Discover
            </Text>
          ),
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={assets.exploreIconPrimary}
                resizeMode="contain"
                style={{
                  width: size - 3,
                  height: size - 3,
                  opacity: focused ? 1 : 0.3,
                }}
              />
            );
          },
        }}
      />
      <ExplorerStack.Screen
        name="Bookmark"
        component={Bookmark}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                opacity: focused ? 1 : 0.3,
                color: COLORS.primary,
                fontFamily: 'Poppins-Regular',
                marginTop: hp(0.5),
              }}
            >
              Bookmark
            </Text>
          ),
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={assets.bookmarkIconPrimary}
                resizeMode="contain"
                style={{
                  width: size - 3,
                  height: size - 3,
                  opacity: focused ? 1 : 0.3,
                }}
              />
            );
          },
        }}
      />
      <ExplorerStack.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                opacity: focused ? 1 : 0.3,
                color: COLORS.primary,
                fontFamily: 'Poppins-Regular',
                marginTop: hp(0.5),
              }}
            >
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={assets.profileIconPrimary}
                resizeMode="contain"
                style={{
                  width: size - 3,
                  height: size - 3,
                  opacity: focused ? 1 : 0.3,
                }}
              />
            );
          },
        }}
      />
    </ExplorerStack.Navigator>
  );
}
