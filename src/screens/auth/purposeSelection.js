import { defaultSerializeQueryArgs } from '@reduxjs/toolkit/query';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import assets from '../../assets/index';
import { COLORS } from '../../constants';
import { hp, wp } from '../../utils/responsive';
import { CustomButton } from '../../components';
import { logoutUser } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks';
import { COLLECTIONS, firebaseService } from '../../services';
function PurposeSelection({ navigation }) {
  const [selected, setSelected] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleContinue = async () => {
    if (selected === 'explore') {
      navigation.replace('ExplorerHome');
    } else if (selected === 'showcase') {
      setIsLoading(true);
      const businesses = await firebaseService.queryCollection(
        COLLECTIONS.BUSINESSES,
        'userId',
        '==',
        firebaseService.getCurrentUser().uid,
      );
      console.log(businesses);
      if (businesses.docs.length > 0) {
        navigation.navigate('Dashboard', {
          businesses: businesses.docs.map(doc => {
            return { ...doc.data(), id: doc.id };
          }),
        });
      } else {
        navigation.navigate('BusinessProfileSetup');
      }
      setIsLoading(false);
    }
  };
  function logout() {
    dispatch(logoutUser());
    navigation.replace('UnAuthNavigator');
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={logout}>
          <Image
            source={assets.backIcon}
            style={styles.backArrow}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>How will you use</Text>
        <Text style={styles.appName}>
          Local<Text style={styles.boldFindz}>Findz</Text>
        </Text>

        <Text style={styles.subText}>
          Choose your purpose — explore new places or showcase your business.
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, selected === 'explore' && styles.cardSelected]}
          onPress={() => setSelected('explore')}
        >
          <Image
            source={assets.usercard} // Replace with your icon
            style={styles.cardIcon}
            resizeMode="contain"
          />

          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Explore & Discover</Text>
            <Text style={styles.cardDescription}>
              Find hidden gems, explore new locations, and connect with the best
              spots around you.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selected === 'showcase' && styles.cardSelected]}
          onPress={() => setSelected('showcase')}
        >
          <Image
            source={assets.store} // Replace with your icon
            style={styles.cardIcon}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Showcase Store</Text>
            <Text style={styles.cardDescription}>
              Register your business, attract more visitors, and let people
              discover your location easily.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <CustomButton
        style={styles.continueButton}
        title="Continue"
        onPress={handleContinue}
        disabled={!selected || isLoading}
        loading={isLoading}
        loadingColor={COLORS.primary}
        textStyle={[
          styles.continueText,
          selected ? styles.continueTextActive : styles.continueTextDisabled,
        ]}
        variant={selected ? 'primary' : 'secondary'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    zIndex: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: hp(55),
    paddingVertical: hp(10),
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: {
    position: 'absolute',
    top: hp(5),
    left: wp(5),
  },
  backArrow: {
    width: wp(5),
    height: wp(5),
  },

  headerTitle: {
    color: COLORS.white,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(3.5),
  },
  appName: {
    color: COLORS.white,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(3.5),
  },
  boldFindz: {
    fontFamily: 'Poppins-Bold',
    color: COLORS.black,
  },
  subText: {
    color: COLORS.white,
    fontFamily: 'Poppins-Regular',
    width: wp(70),
    alignSelf: 'center',
    fontSize: hp(1.5),
  },
  cardContainer: {
    marginTop: hp(25),
    paddingHorizontal: wp(15),
    paddingVertical: hp(10),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(4),
    paddingVertical: hp(5),
    paddingHorizontal: wp(3),
    marginBottom: hp(3),
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cardIcon: {
    width: hp(10),
    height: hp(10),
    marginRight: wp(1),
  },

  cardTextContainer: {
    flex: 1,
  },

  cardTitle: {
    color: COLORS.black,
    fontFamily: 'Poppins-Bold',
    fontSize: hp(1.8),
  },

  cardDescription: {
    color: COLORS.black,
    fontFamily: 'Poppins-Regular',
    fontSize: hp(1.5),
  },

  continueButton: {
    marginBottom: hp(10),
    alignSelf: 'center',
    borderRadius: wp(4),
    width: wp(90),
    position: 'absolute',
    bottom: hp(-8),
  },

  continueActive: {
    backgroundColor: '#A020F0',
  },

  continueDisabled: {
    backgroundColor: '#E0E0E0',
  },

  continueText: {
    fontSize: 16,
    fontWeight: '600',
  },

  continueTextActive: {
    color: '#fff',
  },

  continueTextDisabled: {
    color: '#aaa',
  },
});
export default PurposeSelection;
