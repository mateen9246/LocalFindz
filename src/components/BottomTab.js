import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { hp, wp } from '../utils/responsive';
import assets from '../assets';

export default function BottomTab({ activeTab, navigation }) {
  const size = wp(5);
  return (
    <View style={styles.container}>
      <View style={styles.tabItemsContainer}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Image
            resizeMode="contain"
            source={assets.dashboardIcon}
            style={{
              width: size,
              height: size,
              opacity: activeTab === 'Dashboard' ? 1 : 0.6,
            }}
          />
          <Text
            style={[
              styles.tabItemText,
              { opacity: activeTab === 'Dashboard' ? 1 : 0.6 },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Shops')}
        >
          <Image
            resizeMode="contain"
            source={assets.shopIcon}
            style={{
              width: size,
              height: size,
              opacity: activeTab === 'Shops' ? 1 : 0.6,
            }}
          />
          <Text
            style={[
              styles.tabItemText,
              { opacity: activeTab === 'Shops' ? 1 : 0.6 },
            ]}
          >
            Shops
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fabButton}>
        <TouchableOpacity
          onPress={() => navigation.navigate('BusinessProfileSetup')}
        >
          <Image
            source={assets.bottomPlusIcon}
            style={{ width: wp(10), height: wp(10), resizeMode: 'contain' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tabItemsContainer}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Image
            source={assets.favIcon}
            resizeMode="contain"
            style={{
              width: size,
              height: size,
              opacity: activeTab === 'Notifications' ? 1 : 0.6,
            }}
          />
          <Text
            style={[
              styles.tabItemText,
              { opacity: activeTab === 'Notifications' ? 1 : 0.6 },
            ]}
          >
            Notifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('OwnerProfile')}
        >
          <Image
            source={assets.profileIcon}
            resizeMode="contain"
            style={{
              width: size,
              height: size,
              opacity: activeTab === 'Profile' ? 1 : 0.6,
            }}
          />
          <Text
            style={[
              styles.tabItemText,
              { opacity: activeTab === 'Profile' ? 1 : 0.6 },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    width: wp(90),
    height: hp(8),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: hp(2),
    alignSelf: 'center',
    borderRadius: hp(20),
    paddingHorizontal: wp(5),
    zIndex: 1000,
  },
  tabItemsContainer: {
    width: wp(32),
    height: hp(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemText: {
    color: COLORS.white,
    marginTop: hp(0.5),
    fontSize: wp(2.5),
    fontFamily: 'Poppins-Regular',
  },
  fabButton: {
    position: 'absolute',
    bottom: hp(3.5),
    right: wp(36),
    backgroundColor: COLORS.primary,
    width: wp(20),
    height: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(100),
    zIndex: 10001,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
