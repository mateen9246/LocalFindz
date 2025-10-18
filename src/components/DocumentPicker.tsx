import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
  pick,
} from '@react-native-documents/picker';
import PoppinsText from './PoppinsText';
import { COLORS } from '../constants';
import { hp, wp } from '../utils/responsive';
import { Icon } from './index';

interface DocumentPickerProps {
  onDocumentSelected?: (document: DocumentPickerResponse | null) => void;
  allowedTypes?: string[];
  maxFileSize?: number; // in MB
  containerStyle?: any;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const DocumentPickerComponent: React.FC<DocumentPickerProps> = ({
  onDocumentSelected,
  allowedTypes = [types.pdf],
  maxFileSize = 10, // 10MB default
  containerStyle,
  placeholder = 'Select a document',
  leftIcon,
  rightIcon,
}) => {
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentPickerResponse | null>(null);

  const pickDocument = async () => {
    try {
      const result = await pick({
        type: allowedTypes,
        copyTo: 'cachesDirectory',
      });

      if (result && result.length > 0) {
        const document = result[0];

        // Check file size
        const fileSizeInMB = (document.size || 0) / (1024 * 1024);
        if (fileSizeInMB > maxFileSize) {
          Alert.alert(
            'File Too Large',
            `Please select a file smaller than ${maxFileSize}MB. Current file size: ${fileSizeInMB.toFixed(
              2,
            )}MB`,
          );
          return;
        }

        setSelectedDocument(document);
        onDocumentSelected?.(document);
      }
    } catch (err) {
      // Check if user cancelled the picker
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        err.code === 'DOCUMENT_PICKER_CANCELED'
      ) {
        // User cancelled the picker
        return;
      }

      console.error('Document picker error:', err);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const removeDocument = () => {
    setSelectedDocument(null);
    onDocumentSelected?.(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileName = (uri: string): string => {
    const parts = uri.split('/');
    return parts[parts.length - 1] || 'Unknown file';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {selectedDocument ? (
        <View style={styles.selectedDocumentContainer}>
          <View style={styles.documentInfo}>
            {leftIcon && (
              <View style={styles.leftIconContainer}>{leftIcon}</View>
            )}
            <View style={styles.documentDetails}>
              <PoppinsText style={styles.documentName} numberOfLines={1}>
                {selectedDocument.name || getFileName(selectedDocument.uri)}
              </PoppinsText>
              <PoppinsText style={styles.documentSize}>
                {formatFileSize(selectedDocument.size || 0)}
              </PoppinsText>
            </View>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={removeDocument}
            activeOpacity={0.7}
          >
            <Icon
              name="close"
              size={16}
              color={COLORS.white}
              family="ionicons"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={pickDocument}
          activeOpacity={0.7}
        >
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <PoppinsText style={styles.placeholderText}>
            {placeholder}
          </PoppinsText>
          {rightIcon && (
            <View style={styles.rightIconContainer}>{rightIcon}</View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
  },
  pickerContainer: {
    backgroundColor: COLORS.textInputBg,
    height: hp('7'),
    width: wp('90'),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textInputBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  selectedDocumentContainer: {
    backgroundColor: COLORS.textInputBg,
    height: hp('7'),
    width: wp('90'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    flex: 1,
    marginLeft: wp(3),
  },
  documentName: {
    fontSize: hp(1.9),
    color: COLORS.textColorPr,
    fontFamily: 'Poppins-Medium',
    marginBottom: hp(0.2),
  },
  documentSize: {
    fontSize: hp(1.4),
    color: COLORS.darkGray,
    fontFamily: 'Poppins-Regular',
  },
  leftIconContainer: {
    marginRight: wp(3),
  },
  rightIconContainer: {
    marginLeft: wp(3),
  },
  placeholderText: {
    flex: 1,
    fontSize: hp(1.9),
    color: COLORS.textInput,
    fontFamily: 'Poppins-Regular',
  },
  removeButton: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
});

export default DocumentPickerComponent;
