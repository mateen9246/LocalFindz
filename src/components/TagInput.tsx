import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { hp, wp } from '../utils/responsive';
import { COLORS } from '../constants';
import { PoppinsText } from './index';

interface TagInputProps {
  placeholder?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  leftIcon?: React.ReactNode;
  containerStyle?: any;
  maxTags?: number;
}

const TagInput: React.FC<TagInputProps> = ({
  placeholder = 'Add tags...',
  tags,
  onTagsChange,
  leftIcon,
  containerStyle,
  maxTags = 5,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue('');
    } else if (tags.length >= maxTags) {
      Alert.alert('Limit Reached', `You can only add up to ${maxTags} tags.`);
    } else if (tags.includes(trimmedTag)) {
      Alert.alert('Duplicate Tag', 'This tag already exists.');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handleInputChange = (text: string) => {
    // Add tag when user types space or comma
    if (text.endsWith(' ') || text.endsWith(',')) {
      const tagToAdd = text.slice(0, -1);
      if (tagToAdd.trim()) {
        addTag(tagToAdd);
      }
    } else {
      setInputValue(text);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Input Field */}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <TouchableOpacity disabled={true}>{leftIcon}</TouchableOpacity>
        )}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithIcon : {}]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textInput}
          value={inputValue}
          onChangeText={handleInputChange}
          onSubmitEditing={handleInputSubmit}
          returnKeyType="done"
          blurOnSubmit={false}
        />
      </View>

      {/* Tags Display */}
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <PoppinsText style={styles.tagText}>{tag}</PoppinsText>
              <TouchableOpacity
                onPress={() => removeTag(tag)}
                style={styles.removeButton}
              >
                <PoppinsText style={styles.removeButtonText}>×</PoppinsText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Tag Limit Indicator */}
      <PoppinsText style={styles.tagLimitText}>
        {tags.length}/{maxTags} tags
      </PoppinsText>
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
  inputWithIcon: {
    width: wp(55),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(1),
    gap: wp(2),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 15,
    marginBottom: hp(0.5),
  },
  tagText: {
    color: COLORS.white,
    fontSize: hp(1.6),
    fontFamily: 'Poppins-Regular',
    marginRight: wp(1),
  },
  removeButton: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Bold',
    lineHeight: hp(1.8),
  },
  tagLimitText: {
    fontSize: hp(1.4),
    color: COLORS.darkGray,
    marginTop: hp(0.5),
    fontFamily: 'Poppins-Regular',
  },
});

export default TagInput;
