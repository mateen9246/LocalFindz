import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { hp, wp } from '../../utils/responsive'; // optional if you have these
import { COLORS } from '../../constants'; // expects primary/black/white
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground, PoppinsText } from '../../components';
import assets from '../../assets';
export default function Welcome({ navigation }) {
  return (
    <GradientBackground style={styles.bg}>
      <Image
        source={assets.pattern}
        style={styles.pattern}
        resizeMode="contain"
      />
      <SafeAreaView style={styles.safe}>
        <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        {/* CTA buttons */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SignUp')}
          >
            <PoppinsText style={styles.ghostText}>Sign Up</PoppinsText>
          </TouchableOpacity>
          <View style={[styles.primaryBtn, { marginTop: hp(2) }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Image source={assets.blurBg} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: hp(20),
    height: hp(20),
    marginTop: hp(20),
  },
  pattern: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
    bottom: hp(-25),
    left: 0,
    alignSelf: 'flex-end',
  },
  ctaWrap: {
    width: wp(90),
    marginBottom: hp(5),
  },
  primaryBtn: {
    width: wp(90),
    height: hp(7),
    backgroundColor: COLORS?.white,
    borderRadius: hp(0.7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtn: {
    width: wp(90),
    height: hp(7.5),
    backgroundColor: COLORS?.white,
    borderRadius: hp(0.7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    color: COLORS?.primary || '#7B1FA2',
    fontSize: hp(1.9),
    fontWeight: 'bold',
  },
});
