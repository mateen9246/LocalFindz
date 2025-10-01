import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface PoppinsTextProps extends TextProps {
  weight?: 'regular' | 'medium' | 'bold';
  children: React.ReactNode;
}

/**
 * Text component that uses the Poppins font family
 * Supports different font weights: regular, medium, and bold
 */
const PoppinsText: React.FC<PoppinsTextProps> = ({ 
  weight = 'regular', 
  style, 
  children, 
  ...props 
}) => {
  const getFontFamily = (fontWeight: 'regular' | 'medium' | 'bold'): string => {
    switch (fontWeight) {
      case 'bold':
        return 'Poppins-Bold';
      case 'medium':
        return 'Poppins-Medium';
      case 'regular':
      default:
        return 'Poppins-Regular';
    }
  };

  return (
    <Text 
      style={[
        styles.text, 
        { fontFamily: getFontFamily(weight) }, 
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Default text styles can be added here
  },
});

export default PoppinsText;
