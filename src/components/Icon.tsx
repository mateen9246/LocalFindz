import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { COLORS } from '../constants';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
  family?: 'fontawesome' | 'ionicons' | 'poppins';
  weight?: 'regular' | 'medium' | 'bold';
}

/**
 * Enhanced icon component with support for FontAwesome, Ionicons, and Poppins font
 * Supports both vector icons and custom text with Poppins font family
 */
const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  color = COLORS.textInput, 
  style,
  family = 'fontawesome',
  weight = 'regular'
}) => {
  // Get Poppins font family based on weight
  const getPoppinsFontFamily = (fontWeight: 'regular' | 'medium' | 'bold'): string => {
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

  // Get icon symbol for Poppins text-based icons
  const getPoppinsIconSymbol = (iconName: string): string => {
    const iconMap: { [key: string]: string } = {
      'user': '👤',
      'person': '👤',
      'email': '✉️',
      'mail': '✉️',
      'lock': '🔒',
      'password': '🔒',
      'eye': '👁️',
      'eye-slash': '🙈',
      'eye-off': '🙈',
      'visibility': '👁️',
      'visibility-off': '🙈',
      'home': '🏠',
      'search': '🔍',
      'heart': '❤️',
      'star': '⭐',
      'settings': '⚙️',
      'menu': '☰',
      'close': '✕',
      'check': '✓',
      'plus': '+',
      'minus': '−',
      'arrow-left': '←',
      'arrow-right': '→',
      'arrow-up': '↑',
      'arrow-down': '↓',
    };
    
    return iconMap[iconName] || '?';
  };

  // Render based on icon family
  if (family === 'poppins') {
    return (
      <Text style={[
        styles.icon, 
        { 
          fontSize: size, 
          color,
          fontFamily: getPoppinsFontFamily(weight)
        }, 
        style
      ]}>
        {getPoppinsIconSymbol(name)}
      </Text>
    );
  }

  if (family === 'ionicons') {
    return (
      <Ionicons 
        name={name as any} 
        size={size} 
        color={color} 
        style={style}
      />
    );
  }

  // Default to FontAwesome
  return (
    <FontAwesome 
      name={name as any} 
      size={size} 
      color={color} 
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

export default Icon;
