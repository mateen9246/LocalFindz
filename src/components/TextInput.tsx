import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { hp, wp } from '../utils/responsive';
import { COLORS } from '../constants';
import { PoppinsText } from './index';

interface CustomTextInputProps extends TextInputProps {
  error?: string;
  containerStyle?: any;
  inputStyle?: any;
  errorStyle?: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const TextInput: React.FC<CustomTextInputProps> = ({
  error,
  containerStyle,
  inputStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        {leftIcon && (
          <TouchableOpacity disabled={true}>{leftIcon}</TouchableOpacity>
        )}
        <RNTextInput
          style={[styles.input, error && styles.inputError, inputStyle, style]}
          placeholderTextColor={COLORS.textInput}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <PoppinsText style={[styles.error, errorStyle]}>{error}</PoppinsText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(0.5),
  },
  inputContainer: {
    height: hp('7'),
    width: wp('90'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textInputBg,
    color: COLORS.textColorPr,
    borderWidth: 1,
    borderColor: COLORS.textInputBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  input: {
    fontSize: hp(1.9),
    fontFamily: 'Poppins-Regular',
    alignSelf: 'center',
    height: hp('7'),
    width: wp(65),
    marginLeft: wp(5),
  },
  rightIconContainer: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#fff5f5',
  },
  error: {
    fontSize: 14,
    color: COLORS.danger,
    marginTop: 4,
  },
});

export default TextInput;
