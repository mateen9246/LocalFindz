import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/auth/explorer/Home';
import Dashboard from '../screens/auth/business/Dashboard';

import BusinessProfileSetup from '../screens/auth/business/businessProfileSetup';
import PurposeSelection from '../screens/auth/purposeSelection';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import assets from '../assets';
import { COLORS } from '../constants';
import { hp, wp } from '../utils/responsive';
import StoreDetails from '../screens/auth/explorer/StoreDetails';

const AuthStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ExplorerStack = createBottomTabNavigator();
export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="PurposeSelection" component={PurposeSelection} />
      <AuthStack.Screen
        name="BusinessProfileSetup"
        component={BusinessProfileSetup}
      />
      <AuthStack.Screen name="ExplorerHome" component={ExplorerNavigator} />
      <AuthStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
    </AuthStack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
        },
        tabBarBackground: () => null,
        headerShadowVisible: false,
        shadowColor: 'transparent',
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderRadius: hp(20),
          marginBottom: hp(1),
          marginHorizontal: wp(4),
          paddingHorizontal: wp(5),
          paddingTop: hp(1),
        },
        tabBarLabelStyle: {
          color: COLORS.white,
          marginTop: hp(1),
          fontFamily: 'Poppins-Regular',
        },
      }}
    >
      <BottomTab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={assets.dashboardIcon}
                resizeMode="contain"
                style={{ width: size, height: size }}
              />
            );
          },
        }}
        tabBarLabel="Dashboard"
      />
      <BottomTab.Screen
        name="Shops"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                resizeMode="contain"
                source={assets.shopIcon}
                style={{ width: size, height: size }}
              />
            );
          },
        }}
        tabBarLabel="Dashboard"
      />
      <BottomTab.Screen
        name="BusinessProfileSetup"
        component={BusinessProfileSetup}
        options={{
          tabBarLabel: () => null,
          tabBarButton: props => {
            return (
              <TouchableOpacity
                {...props}
                activeOpacity={1}
                style={{
                  backgroundColor: COLORS.primary,
                  width: hp(8),
                  height: hp(8),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: hp(100),
                  position: 'absolute',
                  top: hp(-5),
                  left: -wp(1),
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              />
            );
          },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={assets.bottomPlusIcon}
                style={{ width: size, height: size }}
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={assets.favIcon}
                resizeMode="contain"
                style={{ width: size, height: size }}
              />
            );
          },
          tabBarLabelStyle: {
            color: COLORS.white,
            marginTop: hp(1),
            fontFamily: 'Poppins-Regular',
            width: wp(20),
          },
        }}
        tabBarLabel="Dashboard"
      />
      <BottomTab.Screen
        name="Profile"
        component={BusinessProfileSetup}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={assets.profileIcon}
                resizeMode="contain"
                style={{ width: size, height: size }}
              />
            );
          },
        }}
        tabBarLabel="Dashboard"
      />
    </BottomTab.Navigator>
  );
}

function ExplorerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExplorerBottomTabs" component={BusinessNavigator} />
      <Stack.Screen name="StoreDetails" component={StoreDetails} />
    </Stack.Navigator>
  );
}

function BusinessNavigator() {
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
        name="Hom1e"
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
        name="Home2"
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
        name="Home3"
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
