import React, { ReactNode } from 'react';
import { StyleSheet, StyleProp, ViewStyle, View, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { COLORS } from '../constants';
import { hp, wp } from '../utils/responsive';

interface BlurBackgroundProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  blurType?:
    | 'xlight'
    | 'light'
    | 'dark'
    | 'extraDark'
    | 'regular'
    | 'prominent';
  blurAmount?: number;
}

const BlurBackground: React.FC<BlurBackgroundProps> = ({
  children,
  style,
  blurType = 'xlight',
  blurAmount = 4,
}) => {
  return (
    <View style={styles.container}>
      {children}
      <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={0.3}
        reducedTransparencyFallbackColor="white"
      />
    </View>
  );
};

export default BlurBackground;

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    height: hp(7),
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    opacity: 0.6,
    borderRadius: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
