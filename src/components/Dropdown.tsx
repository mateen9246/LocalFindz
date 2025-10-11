import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from './Icon';
import { COLORS } from '../constants';
import { hp, wp } from '../utils/responsive';

interface PickerItem {
  label: string;
  value: string;
}

interface CustomPickerProps {
  label?: string;
  placeholder?: string;
  items: PickerItem[];
  value: string | null;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  leftIcon: any;
  onLeftIconPress: any;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  placeholder = 'Select an option...',
  items,
  value,
  onValueChange,
  disabled = false,
  leftIcon,
  onLeftIconPress,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.pickerWrapper, disabled && styles.disabled]}>
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftIconPress}
            disabled={!onLeftIconPress}
            style={styles.leftIcon}
          >
            {leftIcon}
          </TouchableOpacity>
        )}
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          value={value}
          placeholder={{ label: placeholder, value: null }}
          useNativeAndroidPickerStyle={false}
          disabled={disabled}
          style={{
            inputIOS: styles.input,
            inputAndroid: styles.input,
            placeholder: styles.placeholder,
          }}
          Icon={() => (
            <Icon
              name="chevron-down"
              size={15}
              style={styles.dropdownArrow}
              color={COLORS.textInput}
            />
          )}
        />
      </View>
    </View>
  );
};

export default CustomPicker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: COLORS.textColorPr,
    marginBottom: 6,
  },
  pickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.textInputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.textInputBorder,
    paddingHorizontal: 15,
    paddingVertical: 2,
    height: hp('7'),
    width: wp(90),
  },
  leftIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('3'),
    width: hp('3'),
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    height: hp('7'),
    width: wp(70),
    color: COLORS.darkGray,
    paddingVertical: 12,
  },
  placeholder: {
    color: COLORS.textColorPr,
  },
  dropdownArrow: {
    fontSize: 20,
    color: COLORS.black,
    position: 'absolute',
    right: 10,
    top: hp(2),
  },
  disabled: {
    opacity: 0.6,
  },
});
