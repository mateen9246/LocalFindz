import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { hp, wp } from '../utils/responsive';
import { COLORS } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = true,
  style,
  textStyle,
  loadingColor = COLORS.white,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle[] = [styles.button];

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.buttonSmall);
        break;
      case 'large':
        baseStyle.push(styles.buttonLarge);
        break;
      default:
        baseStyle.push(styles.buttonMedium);
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      case 'danger':
        baseStyle.push(styles.buttonDanger);
        break;
      default:
        baseStyle.push(styles.buttonPrimary);
    }

    // State styles
    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    }

    // Width style
    if (fullWidth) {
      baseStyle.push(styles.buttonFullWidth);
    }

    return StyleSheet.flatten([baseStyle, style]);
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle[] = [styles.buttonText];

    // Size text styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.buttonTextSmall);
        break;
      case 'large':
        baseStyle.push(styles.buttonTextLarge);
        break;
      default:
        baseStyle.push(styles.buttonTextMedium);
    }

    // Variant text styles
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.buttonTextSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.buttonTextOutline);
        break;
      case 'danger':
        baseStyle.push(styles.buttonTextDanger);
        break;
      default:
        baseStyle.push(styles.buttonTextPrimary);
    }

    // State text styles
    if (disabled || loading) {
      baseStyle.push(styles.buttonTextDisabled);
    }

    return StyleSheet.flatten([baseStyle, textStyle]);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={getButtonStyle()}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={loadingColor} size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontFamily: 'Poppins-Bold',
  },

  // Size styles
  buttonSmall: {
    height: hp('5'),
    paddingHorizontal: wp('4'),
  },
  buttonMedium: {
    height: hp('6'),
    paddingHorizontal: wp('6'),
  },
  buttonLarge: {
    height: hp('7'),
    paddingHorizontal: wp('8'),
  },

  // Variant styles
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonDanger: {
    backgroundColor: COLORS.danger,
  },

  // State styles
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
    opacity: 0.6,
  },

  // Width styles
  buttonFullWidth: {
    width: '100%',
  },

  // Text styles
  buttonText: {
    textAlign: 'center',
    fontSize: hp(1.9),
    fontFamily: 'Poppins-Bold',
  },

  // Text size styles
  buttonTextSmall: {
    fontSize: hp(1.9),
  },
  buttonTextMedium: {
    fontSize: hp(1.9),
  },
  buttonTextLarge: {
    fontSize: hp(1.9),
  },

  // Text variant styles
  buttonTextPrimary: {
    color: COLORS.white,
  },
  buttonTextSecondary: {
    color: COLORS.white,
  },
  buttonTextOutline: {
    color: COLORS.primary,
  },
  buttonTextDanger: {
    color: COLORS.white,
  },

  // Text state styles
  buttonTextDisabled: {
    color: COLORS.textSecondary,
  },
});

export default Button;
