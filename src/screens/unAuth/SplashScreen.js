import { React, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import assets from '../../assets';
import { GradientBackground } from '../../components';
import { hp, wp } from '../../utils/responsive';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Welcome');
    }, 1000);
  }, []);

  return (
    <GradientBackground style={styles.bg}>
      <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
      <Image
        source={assets.pattern}
        style={styles.pattern}
        resizeMode="contain"
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    opacity: 0.12,
    alignSelf: 'stretch',
    resizeMode: 'cover',
  },
  logo: {
    width: hp(20),
    height: hp(20),
    marginBottom: hp(40),
  },
  pattern: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
    bottom: hp(-25),
    left: 0,
    alignSelf: 'flex-end',
  },
});
