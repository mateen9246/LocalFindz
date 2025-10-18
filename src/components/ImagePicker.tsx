import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import PoppinsText from './PoppinsText';
import { COLORS } from '../constants';
import { hp, wp } from '../utils/responsive';

interface ImagePickerProps {
  onImagesSelected?: (images: string[]) => void;
  maxImages?: number;
  containerStyle?: any;
}

interface ImageSlot {
  id: string;
  uri: string | null;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  onImagesSelected,
  maxImages = 3,
  containerStyle,
}) => {
  const [selectedImages, setSelectedImages] = useState<ImageSlot[]>(
    Array.from({ length: maxImages }, (_, index) => ({
      id: `slot-${index}`,
      uri: null,
    })),
  );

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const showImagePicker = () => {
    Alert.alert('Select Image', 'Choose an option', [
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Gallery', onPress: () => openGallery() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission denied',
        'Camera permission is required to take photos.',
      );
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as const,
      includeBase64: false,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        handleImageSelected(response.assets[0].uri!);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as const,
      includeBase64: false,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        handleImageSelected(response.assets[0].uri!);
      }
    });
  };

  const handleImageSelected = (uri: string) => {
    const emptySlotIndex = selectedImages.findIndex(slot => slot.uri === null);

    if (emptySlotIndex !== -1) {
      const updatedImages = [...selectedImages];
      updatedImages[emptySlotIndex] = {
        ...updatedImages[emptySlotIndex],
        uri,
      };

      setSelectedImages(updatedImages);

      // Call the callback with all selected image URIs
      const selectedUris = updatedImages
        .filter(slot => slot.uri !== null)
        .map(slot => slot.uri!);

      onImagesSelected?.(selectedUris);
    } else {
      Alert.alert(
        'Limit Reached',
        `You can only select up to ${maxImages} images.`,
      );
    }
  };

  const removeImage = (slotId: string) => {
    const updatedImages = selectedImages.map(slot =>
      slot.id === slotId ? { ...slot, uri: null } : slot,
    );

    setSelectedImages(updatedImages);

    // Call the callback with updated image URIs
    const selectedUris = updatedImages
      .filter(slot => slot.uri !== null)
      .map(slot => slot.uri!);

    onImagesSelected?.(selectedUris);
  };

  const renderImageSlot = (slot: ImageSlot, index: number) => {
    const isEmpty = slot.uri === null;

    return (
      <View key={slot.id} style={styles.imageSlot}>
        {isEmpty ? (
          <TouchableOpacity
            style={styles.emptySlot}
            onPress={showImagePicker}
            activeOpacity={0.7}
          >
            <View style={styles.plusIcon}>
              <PoppinsText style={styles.plusText}>+</PoppinsText>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.filledSlot}>
            <Image source={{ uri: slot.uri! }} style={styles.selectedImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(slot.id)}
              activeOpacity={0.7}
            >
              <PoppinsText style={styles.removeButtonText}>×</PoppinsText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <PoppinsText style={styles.title}>Store Images</PoppinsText>
      <PoppinsText style={styles.subtitle}>
        Add up to {maxImages} images to showcase your store
      </PoppinsText>

      <View style={styles.imageGrid}>
        {selectedImages.map((slot, index) => renderImageSlot(slot, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(2),
  },
  title: {
    fontSize: hp(2.2),
    fontFamily: 'Poppins-Bold',
    color: COLORS.textColorPr,
    marginBottom: hp(0.5),
  },
  subtitle: {
    fontSize: hp(1.6),
    fontFamily: 'Poppins-Regular',
    color: COLORS.darkGray,
    marginBottom: hp(2),
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  imageSlot: {
    width: wp(28),
    height: wp(28),
    marginBottom: hp(1),
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.textInputBg,
    borderWidth: 2,
    borderColor: COLORS.textInputBorder,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
  },
  plusText: {
    fontSize: hp(5),
    color: COLORS.gray,
    fontFamily: 'Poppins-Regular',
    lineHeight: hp(2.5),
  },
  addImageText: {
    fontSize: hp(1.4),
    color: COLORS.darkGray,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  filledSlot: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -wp(2),
    right: -wp(2),
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  removeButtonText: {
    fontSize: hp(2),
    color: COLORS.white,
    fontFamily: 'Poppins-Bold',
    lineHeight: hp(2),
  },
});

export default ImagePicker;
