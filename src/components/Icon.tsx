import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

/**
 * Simple icon component using Unicode symbols
 * This is a temporary solution until a proper icon library is added
 */
const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  color = COLORS.textInput, 
  style 
}) => {
  const getIconSymbol = (iconName: string): string => {
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
    };
    
    return iconMap[iconName] || '?';
  };

  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      {getIconSymbol(name)}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

export default Icon;
