import React, { ReactNode } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../constants';
interface GradientBackgroundProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  colors: string[];
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  colors,
}) => {
  return (
    <LinearGradient
      colors={colors || [COLORS.primary, COLORS.secondary]} // Adjust gradient shades
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
