import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { hp, wp } from '../../../utils/responsive';
import { COLORS } from '../../../constants';
import {
  PoppinsText,
  CustomTextInput,
  CustomButton,
  Icon,
  TagInput,
} from '../../../components';
import assets from '../../../assets/index';
import BusinessHours from './BusinessHours';
import CustomPicker from '../../../components/Dropdown';
// import MapView, { Circle, Marker } from 'react-native-maps';

/**
 * Business Profile Setup Screen
 *
 * This screen allows users to set up their business profile by entering
 * business information including name, contact details, tax information,
 * and description. Features a 5-step progress indicator.
 */
const BusinessProfileSetup = () => {
  const title = [
    'Tell Us About Your Business',
    'Where is your store located',
    'Set standard hours',
    'Showcase your store',
  ];
  const items = [
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Café', value: 'cafe' },
    { label: 'Shop', value: 'shop' },
  ];
  const [selected, setSelected] = useState('');
  const [businessData, setBusinessData] = useState({
    businessName: '',
    contactNumber: '',
    taxId: '',
    registrationNo: '',
    description: '',
    zipCode: '',
    tags: [],
    businessHours: {
      sunday: { isOpen: false, opening: '', closing: '' },
      monday: { isOpen: false, opening: '', closing: '' },
      tuesday: { isOpen: false, opening: '', closing: '' },
      wednesday: { isOpen: false, opening: '', closing: '' },
      thursday: { isOpen: false, opening: '', closing: '' },
      friday: { isOpen: false, opening: '', closing: '' },
      saturday: { isOpen: false, opening: '', closing: '' },
    },
  });
  const [currentStep, setCurrentStep] = useState(1);
  /**
   * Handle continue button press
   */
  const handleContinue = () => {
    // TODO: Implement navigation to next step
    setCurrentStep(currentStep + 1);
  };

  /**
   * Render the progress indicator with 5 steps
   */
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
  const handleImageUpload = () => {
    // Placeholder for image upload functionality
    Alert.alert(
      'Image Upload',
      'Image upload functionality would be implemented here',
    );
  };

  const handlePdfUpload = () => {
    // Placeholder for PDF upload functionality
    Alert.alert(
      'PDF Upload',
      'PDF upload functionality would be implemented here',
    );
  };

  const handleCategorySelect = () => {
    // Placeholder for category selection
    Alert.alert(
      'Category Selection',
      'Category selection would be implemented here',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

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
          </View>
        )}
        {currentStep === 4 && (
          <View style={styles.formSection}>
            <CustomPicker
              placeholder="Choose a category"
              items={items}
              value={selected}
              onValueChange={val => setSelected(val)}
              leftIcon={
                <Image
                  source={assets.categoryIcon}
                  style={{ width: wp(5), height: wp(5) }}
                  resizeMode="contain"
                />
              }
            />

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

            <TouchableOpacity onPress={handlePdfUpload}>
              <View style={styles.pdfUploadContent}>
                <Icon
                  name="paperclip"
                  size={20}
                  color={COLORS.textInput}
                  family="fontawesome"
                />
                <PoppinsText style={styles.pdfUploadText}>
                  PDF file of menu
                </PoppinsText>
                <Icon
                  name="upload"
                  size={20}
                  color={COLORS.primary}
                  family="fontawesome"
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="large"
          fullWidth
          style={styles.continueButton}
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
  pdfUploadContent: {
    backgroundColor: COLORS.textInputBg,
    height: hp('7'),
    width: wp('90'),
    flexDirection: 'row',
    alignItems: 'center',
    color: COLORS.textColorPr,
    borderWidth: 1,
    borderColor: COLORS.textInputBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  pdfUploadText: {
    flex: 1,
    fontSize: hp(1.9),
    color: COLORS.textInput,
    marginLeft: wp(5),
    fontFamily: 'Poppins-Regular',
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
});

export default BusinessProfileSetup;
