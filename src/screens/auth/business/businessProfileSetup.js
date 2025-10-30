import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { hp, wp } from '../../../utils/responsive';
import { COLORS } from '../../../constants';
import {
  PoppinsText,
  CustomTextInput,
  CustomButton,
  Icon,
  TagInput,
  ImagePicker,
  DocumentPicker,
} from '../../../components';
import assets from '../../../assets/index';
import BusinessHours from './BusinessHours';
import CustomPicker from '../../../components/Dropdown';
import { validateBusinessForm } from '../../../utils/validator';
import { firebaseService } from '../../../services/firebase';
import { COLLECTIONS } from '../../../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
// import MapView, { Circle, Marker } from 'react-native-maps';

/**
 * Business Profile Setup Screen
 *
 * This screen allows users to set up their business profile by entering
 * business information including name, contact details, tax information,
 * and description. Features a 5-step progress indicator.
 */
const BusinessProfileSetup = ({ navigation, route }) => {
  const sampleImages = Array.from({ length: 3 }, (_, index) => ({
    id: `slot-${index}`,
    uri: null,
  }));
  const title = [
    'Tell Us About Your Business',
    'Where is your store located',
    'Set standard hours',
    'Showcase your store',
  ];
  const { params } = route;
  const items = [
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Café', value: 'cafe' },
    { label: 'Shop', value: 'shop' },
  ];
  const [dataErrors, setDataErrors] = useState({});
  const [businessData, setBusinessData] = useState(
    !!params?.editBusiness
      ? params.editBusiness
      : {
          businessName: '',
          contactNumber: '',
          taxId: '',
          registrationNo: '',
          description: '',
          zipCode: '',
          tags: [],
          images: [],
          pdfDocument: null,
          selectedCategory: '',
          businessHours: {
            sunday: { isOpen: false, opening: '', closing: '' },
            monday: { isOpen: false, opening: '', closing: '' },
            tuesday: { isOpen: false, opening: '', closing: '' },
            wednesday: { isOpen: false, opening: '', closing: '' },
            thursday: { isOpen: false, opening: '', closing: '' },
            friday: { isOpen: false, opening: '', closing: '' },
            saturday: { isOpen: false, opening: '', closing: '' },
          },
        },
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImages = async imageUris => {
    if (!imageUris || imageUris.length === 0) {
      return { success: true, data: [] };
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await firebaseService.uploadMultipleImages(
        imageUris,
        'business-images',
        progress => {
          setUploadProgress(progress);
        },
      );

      if (result.success) {
        return result;
      } else {
        Alert.alert('Upload Error', result.error);
        return result;
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Upload Error', 'Failed to upload images. Please try again.');
      return { success: false, error: 'Upload failed' };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const uploadPDF = async (documentUri, fileName) => {
    if (!documentUri) {
      return { success: true, data: null };
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await firebaseService.uploadPDF(
        documentUri,
        fileName,
        'business-documents',
        progress => {
          setUploadProgress(progress);
        },
      );

      if (result.success) {
        return result;
      } else {
        Alert.alert('Upload Error', result.error);
        return result;
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      Alert.alert('Upload Error', 'Failed to upload PDF. Please try again.');
      return { success: false, error: 'Upload failed' };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const handleFormSubmission = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // uncomment this when you want to upload images and pdf
      const imageUploadResult = await uploadImages(businessData.images);
      if (!imageUploadResult.success) {
        return;
      }
      const pdfUploadResult = await uploadPDF(
        businessData.pdfDocument?.uri,
        businessData.pdfDocument?.name || 'business-document.pdf',
      );
      if (!pdfUploadResult.success) {
        return;
      }
      // Prepare final business data with uploaded URLs
      const finalBusinessData = {
        ...businessData,
        images: imageUploadResult.data,
        pdfDocument: pdfUploadResult.data,
        userId: firebaseService.getCurrentUser().uid,
        isOpen: true,
      };
      firebaseService.addDocument(COLLECTIONS.BUSINESSES, finalBusinessData);
      Alert.alert('Success', 'Business profile created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('Dashboard');
          },
        },
      ]);
    } catch (error) {
      console.error('Error in form submission:', error);
      Alert.alert(
        'Error',
        'Failed to create business profile. Please try again.',
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const handleEditSubmit = () => {
    if (currentStep == 4) {
      const { isValid, errors, firstErrorKey } =
        validateBusinessForm(businessData);

      if (!isValid) {
        Alert.alert(
          'Error',
          `Can't submit the form due to reason: ${errors[firstErrorKey]}`,
        );
        setDataErrors(errors);
      } else {
        handleFormEdition();
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleFormEdition = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // uncomment this when you want to upload images and pdf
      let finalImages = [];
      if (businessData.images.length > 0) {
        const imagesToUpload = [];
        const prevImages = [];
        businessData.images.forEach(image => {
          if (image.includes('file://')) {
            imagesToUpload.push(image);
          } else {
            prevImages.push(image);
          }
        });
        finalImages = [...prevImages];
        if (imagesToUpload.length > 0) {
          const imageUploadResult = await uploadImages(imagesToUpload);
          if (!imageUploadResult.success) {
            return;
          }
          finalImages = [...prevImages, ...imageUploadResult.data];
        }
      }
      let finalPDF = null;
      if (
        businessData.pdfDocument &&
        !businessData.pdfDocument.includes('https://firebasestorage')
      ) {
        const pdfUploadResult = await uploadPDF(
          businessData.pdfDocument?.uri,
          businessData.pdfDocument?.name || 'business-document.pdf',
        );
        if (!pdfUploadResult.success) {
          return;
        }
        finalPDF = pdfUploadResult.data;
      } else {
        finalPDF = businessData.pdfDocument;
      }
      // Prepare final business data with uploaded URLs
      const finalBusinessData = {
        ...businessData,
        images: finalImages,
        pdfDocument: finalPDF,
        userId: firebaseService.getCurrentUser().uid,
      };

      firebaseService.updateDocument(
        COLLECTIONS.BUSINESSES,
        params.editBusiness.id,
        finalBusinessData,
      );
      Alert.alert('Success', 'Business profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('Dashboard');
          },
        },
      ]);
    } catch (error) {
      console.error('Error in form submission:', error);
      Alert.alert(
        'Error',
        'Failed to create business profile. Please try again.',
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const handleContinue = () => {
    if (currentStep == 4) {
      const { isValid, errors, firstErrorKey } =
        validateBusinessForm(businessData);

      if (!isValid) {
        Alert.alert(
          'Error',
          `Can't submit the form due to reason: ${errors[firstErrorKey]}`,
        );
        setDataErrors(errors);
      } else {
        handleFormSubmission();
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  const renderProgressIndicator = () => {
    const steps = [1, 2, 3, 4];

    return (
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={step}
            style={styles.progressStepContainer}
            onPress={() => setCurrentStep(step)}
          >
            <View
              style={[
                styles.progressDot,
                step <= currentStep
                  ? styles.progressDotActive
                  : styles.progressDotInactive,
              ]}
            >
              <View
                style={[
                  styles.progressDotInner,
                  step <= currentStep
                    ? styles.progressDotInnerActive
                    : styles.progressDotInnerInactive,
                ]}
              />
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  step < currentStep
                    ? styles.progressLineActive
                    : styles.progressLineInactive,
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Header Section */}
        <View style={styles.headerSection}>
          <PoppinsText style={styles.title}>
            {title[currentStep - 1]}
          </PoppinsText>
          <PoppinsText style={styles.subtitle} weight="regular">
            Tell us a bit more about your store to complete your business
            profile
          </PoppinsText>
        </View>

        {/* Form Section */}
        {currentStep === 1 && (
          <View style={styles.formSection}>
            {/* Business Name */}
            <CustomTextInput
              placeholder="Business Name"
              value={businessData.businessName}
              onChangeText={text =>
                setBusinessData({ ...businessData, businessName: text })
              }
              leftIcon={
                <Image
                  source={assets.homeIcon}
                  style={styles.iconStyles}
                  resizeMode="contain"
                />
              }
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
            />
            {dataErrors.businessName && (
              <PoppinsText style={styles.error}>
                {dataErrors.businessName}
              </PoppinsText>
            )}
            {/* Contact Number */}
            <CustomTextInput
              placeholder="Contact Number"
              value={businessData.contactNumber}
              onChangeText={text =>
                setBusinessData({ ...businessData, contactNumber: text })
              }
              keyboardType="phone-pad"
              leftIcon={
                <Image
                  source={assets.phoneIcon}
                  style={styles.iconStyles}
                  resizeMode="contain"
                />
              }
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
            />
            {dataErrors.contactNumber && (
              <PoppinsText style={styles.error}>
                {dataErrors.contactNumber}
              </PoppinsText>
            )}
            {/* Tax ID and Registration No. Row */}
            <View style={styles.rowContainer}>
              <CustomTextInput
                placeholder="Tax ID"
                value={businessData.taxId}
                onChangeText={text =>
                  setBusinessData({ ...businessData, taxId: text })
                }
                leftIcon={
                  <Image
                    source={assets.taxIcon}
                    style={styles.iconStyles}
                    resizeMode="contain"
                  />
                }
                containerStyle={[styles.inputContainer, { marginRight: wp(2) }]}
                inputStyle={styles.input}
                inputContainerStyle={{ width: wp(35) }}
              />
              {dataErrors.taxId && (
                <PoppinsText
                  style={[
                    { position: 'absolute', bottom: hp(-1.5) },
                    styles.error,
                  ]}
                >
                  {dataErrors.taxId}
                </PoppinsText>
              )}
              <CustomTextInput
                placeholder="Registration No."
                value={businessData.registrationNo}
                onChangeText={text =>
                  setBusinessData({ ...businessData, registrationNo: text })
                }
                leftIcon={
                  <Image
                    source={assets.hashtagIcon}
                    style={{ width: wp(5), height: wp(5) }}
                    resizeMode="contain"
                  />
                }
                containerStyle={styles.inputContainer}
                inputStyle={[styles.input, { width: wp(40) }]}
                inputContainerStyle={{ width: wp(53) }}
              />
              {dataErrors.registrationNo && (
                <PoppinsText
                  style={[
                    { position: 'absolute', bottom: hp(-1.5), right: 0 },
                    styles.error,
                  ]}
                >
                  {dataErrors.registrationNo}
                </PoppinsText>
              )}
            </View>

            {/* Description */}
            <CustomTextInput
              placeholder="Description"
              value={businessData.description}
              onChangeText={text =>
                setBusinessData({ ...businessData, description: text })
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              leftIcon={
                <Image
                  source={assets.descriptionIcon}
                  style={styles.iconStyles}
                  resizeMode="contain"
                />
              }
              containerStyle={[
                styles.inputContainer,
                styles.descriptionContainer,
              ]}
              inputStyle={[styles.input, styles.descriptionInput]}
              inputContainerStyle={{
                height: hp(30),
                alignItems: 'flex-start',
                paddingVertical: hp(2),
              }}
            />
            {dataErrors.description && (
              <PoppinsText style={styles.error}>
                {dataErrors.description}
              </PoppinsText>
            )}
          </View>
        )}
        {currentStep === 2 && (
          <View style={styles.formSection}>
            <CustomTextInput
              placeholder="Zip/Postal code"
              value={businessData.zipCode}
              onChangeText={text =>
                setBusinessData({ ...businessData, zipCode: text })
              }
              keyboardType="numeric"
              containerStyle={{ backgroundColor: COLORS.white }}
              inputStyle={{
                backgroundColor: COLORS.white,
                textAlign: 'center',
                textDecorationLine: 'underline',
              }}
              inputContainerStyle={{
                backgroundColor: COLORS.white,
                borderWidth: 0,
                alignItems: 'center',
              }}
            />
            {dataErrors.zipCode && (
              <PoppinsText style={styles.error}>
                {dataErrors.zipCode}
              </PoppinsText>
            )}
            <Image
              source={assets.mapIcon}
              style={styles.mapIcon}
              resizeMethod="contain"
            />
            {/* <View style={styles.mapSection}>
              <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
                mapType="standard"
              >
                <Circle
                  center={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                  radius={distance * 1609.34} // Convert miles to meters
                  strokeColor={COLORS.primary}
                  fillColor={`${COLORS.primary}20`} // 20% opacity
                  strokeWidth={2}
                />

                <Marker
                  coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                  title="Your Store Location"
                  description="This is where your store is located"
                />
              </MapView>

              <View style={styles.mapControls}>
                <TouchableOpacity style={styles.mapControlButton}>
                  <Icon
                    name="locate"
                    family="ionicons"
                    size={20}
                    color={COLORS.textColorPr}
                  />
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        )}
        {currentStep === 3 && (
          <View style={styles.formSection}>
            <BusinessHours
              onBusinessHoursChange={businessHours => {
                setBusinessData({ ...businessData, businessHours });
              }}
              parentBusinessHours={businessData.businessHours}
            />
            {dataErrors.businessHours && (
              <PoppinsText style={styles.error}>
                {dataErrors.businessHours}
              </PoppinsText>
            )}
          </View>
        )}
        {currentStep === 4 && (
          <View style={styles.formSection}>
            {/* Image Picker Section */}
            <ImagePicker
              onImagesSelected={images =>
                setBusinessData({ ...businessData, images })
              }
              selectedImages={
                params?.editBusiness
                  ? sampleImages.map((image, index) => {
                      if (params.editBusiness.images.length > index) {
                        return {
                          uri: params.editBusiness.images[index],
                          id: index.toString(),
                        };
                      } else {
                        return { uri: null, id: index.toString() };
                      }
                    })
                  : sampleImages
              }
              maxImages={3}
              containerStyle={styles.imagePickerContainer}
            />
            {dataErrors.images && (
              <PoppinsText style={styles.error}>
                {dataErrors.images}
              </PoppinsText>
            )}
            <CustomPicker
              placeholder="Choose a category"
              items={items}
              value={businessData.selectedCategory}
              onValueChange={val =>
                setBusinessData({ ...businessData, selectedCategory: val })
              }
              leftIcon={
                <Image
                  source={assets.categoryIcon}
                  style={{ width: wp(5), height: wp(5) }}
                  resizeMode="contain"
                />
              }
            />
            {dataErrors.selectedCategory && (
              <PoppinsText style={styles.error}>
                {dataErrors.selectedCategory}
              </PoppinsText>
            )}
            <TagInput
              placeholder="Add tags..."
              tags={businessData.tags}
              onTagsChange={tags => setBusinessData({ ...businessData, tags })}
              leftIcon={
                <Image
                  source={assets.tagIcon}
                  style={styles.iconStyles}
                  resizeMode="contain"
                />
              }
              containerStyle={styles.inputContainer}
              maxTags={5}
            />
            <PoppinsText style={styles.tagsInstruction}>
              You can add up to 5 tags
            </PoppinsText>
            {dataErrors.tags && (
              <PoppinsText style={styles.error}>{dataErrors.tags}</PoppinsText>
            )}
            <DocumentPicker
              onDocumentSelected={document =>
                setBusinessData({ ...businessData, pdfDocument: document })
              }
              selectedDocument={
                params?.editBusiness
                  ? {
                      uri: params.editBusiness.pdfDocument,
                      name: 'File.pdf',
                      type: 'application/pdf',
                      size: 1000,
                      id: '1',
                    }
                  : businessData.pdfDocument
              }
              placeholder="PDF file of menu"
              leftIcon={
                <Icon
                  name="paperclip"
                  size={20}
                  color={COLORS.textInput}
                  family="fontawesome"
                />
              }
              rightIcon={
                <Icon
                  name="upload"
                  size={20}
                  color={COLORS.primary}
                  family="fontawesome"
                />
              }
              maxFileSize={15} // 15MB limit for PDF files
            />
            {dataErrors.pdfDocument && (
              <PoppinsText style={styles.error}>
                {dataErrors.pdfDocument}
              </PoppinsText>
            )}
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        {isUploading && (
          <View style={styles.uploadProgressContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <PoppinsText style={styles.uploadProgressText}>
              Uploading... {Math.round(uploadProgress)}%
            </PoppinsText>
          </View>
        )}
        <CustomButton
          title={isUploading ? 'Uploading...' : 'Continue'}
          onPress={params?.editBusiness ? handleEditSubmit : handleContinue}
          variant="primary"
          size="large"
          fullWidth
          style={styles.continueButton}
          disabled={isUploading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? hp(2) : hp(4),
    paddingBottom: hp(10), // Space for button
  },
  error: {
    color: COLORS.secondary,
    fontSize: hp(1.5),
    fontFamily: 'Poppins-Regular',
    marginTop: hp(0.2),
  },
  // Progress Indicator Styles
  progressContainer: {
    width: wp(80),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(4),
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDotInnerActive: {
    backgroundColor: COLORS.primary,
  },
  progressDotInnerInactive: {
    backgroundColor: COLORS.gray,
  },
  progressDotInner: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(10),
  },
  progressDot: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  progressDotActive: {
    borderColor: COLORS.primary,
  },
  progressDotInactive: {
    borderColor: COLORS.gray,
  },
  progressLine: {
    width: wp(23),
    height: 4,
  },
  progressLineActive: {
    backgroundColor: COLORS.primary,
  },
  progressLineInactive: {
    backgroundColor: COLORS.gray,
  },

  // Header Styles
  headerSection: {
    marginBottom: hp('4%'),
    paddingHorizontal: wp(5),
  },
  title: {
    fontSize: hp('4%'),
    fontFamily: 'Poppins-Bold',
    color: COLORS.textColorPr,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: COLORS.darkGray,
    textAlign: 'left',
  },

  // Form Styles
  formSection: {
    paddingHorizontal: wp(5),
  },
  iconStyles: {
    width: wp(7),
    height: wp(7),
  },
  inputContainer: {
    marginVertical: hp('1'),
  },
  input: {
    width: wp(70),
  },
  rowContainer: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
  },
  inputContainerStyle: { width: wp(40) },

  descriptionContainer: {
    marginTop: hp('1%'),
  },
  descriptionInput: {
    height: hp(27),
    alignItems: 'flex-start',
  },

  mapSection: {
    marginBottom: hp('3%'),
    position: 'relative',
  },
  map: {
    width: '100%',
    height: hp('40%'),
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapIcon: {
    width: hp(40),
    height: hp(40),
  },
  mapControls: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  mapControlButton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tagsInstruction: {
    fontSize: hp(1.8),
    color: COLORS.darkGray,
    marginBottom: hp(2),
    fontFamily: 'Poppins-Regular',
  },
  imagePickerContainer: {
    marginBottom: hp(3),
  },

  // Button Styles
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp('5%'),
    paddingBottom: Platform.OS === 'ios' ? hp('3%') : hp('2%'),
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.textInputBorder,
  },
  continueButton: {
    borderRadius: 12,
  },
  uploadProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
    paddingVertical: hp(1),
  },
  uploadProgressText: {
    fontSize: hp(1.6),
    color: COLORS.primary,
    fontFamily: 'Poppins-Medium',
    marginLeft: wp(2),
  },
});

export default BusinessProfileSetup;
