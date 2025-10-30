import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Switch,
} from 'react-native';
import { COLORS } from '../../../constants';
import { PoppinsText, Icon } from '../../../components';
import assets from '../../../assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsive';
import { firebaseService } from '../../../services';

const BusinessStoreDetails = ({ navigation, route }) => {
  const { store } = route.params || {};
  console.log('store', store);
  const [isStoreAvailable, setIsStoreAvailable] = useState(store.isOpen);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [storeData, setStoreData] = useState({
    businessName: store?.businessName || 'Kayu Lama Restaurant',
    address: store?.address || 'N/A',
    category: store?.selectedCategory || 'Food & Drink',
    ratings: store?.ratings || '4.9',
    openingTime: openingClosingFinder().openingTime || '09:00 AM',
    closingTime: openingClosingFinder().closingTime || '11:30 PM',
    description: store?.description || 'N/A',
    tags: store?.tags || [
      'Restaurant',
      'Cafe',
      'Great ambiance',
      'best coffee',
    ],
    views: store?.views || '4.9K',
    comments: store?.comments || '4.9K',
    bookmarks: store?.bookmarks || '5K',
    image: store?.images?.[0] || assets.storeImage,
  });
  // Sample data - replace with actual data from store parameter
  function openingClosingFinder() {
    const days = Object.keys(store?.businessHours);
    for (const day of days) {
      if (store?.businessHours[day]?.isOpen) {
        return {
          openingTime: store?.businessHours[day]?.opening,
          closingTime: store?.businessHours[day]?.closing,
        };
      }
    }
  }
  async function toggleStoreAvailability() {
    try {
      await firebaseService.updateDocument('businesses', store?.id, {
        isOpen: !isStoreAvailable,
      });
      setIsStoreAvailable(!isStoreAvailable);
    } catch (error) {
      console.error('Error toggling store availability:', error);
    }
  }
  const graphData = [
    { value: 5, label: 'Aug 9' },
    { value: 8, label: 'Aug 16' },
    { value: 12, label: 'Aug 23' },
    { value: 10, label: 'Aug 30' },
    { value: 15, label: 'Sep 6' },
    { value: 20, label: 'Sep 9' },
  ];

  const maxValue = 25;
  const graphHeight = hp(15);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon
            name="chevron-back"
            family="ionicons"
            size={wp(6)}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <PoppinsText style={styles.headerTitle} weight="bold">
          Insights
        </PoppinsText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Restaurant Image */}
          <Image
            source={
              typeof storeData.image === 'string'
                ? { uri: storeData.image }
                : storeData.image
            }
            style={styles.restaurantImage}
            resizeMode="cover"
          />

          {/* Restaurant Name and Location */}
          <View style={styles.restaurantInfo}>
            <PoppinsText style={styles.restaurantName} weight="bold">
              {storeData.businessName}
            </PoppinsText>
            <View style={styles.locationContainer}>
              <Image
                source={assets.appleIcon}
                style={styles.locationPinIconBlack}
                resizeMode="contain"
              />
              <PoppinsText style={styles.address}>
                {storeData.address}
              </PoppinsText>
            </View>

            {/* Engagement Metrics */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricItem}>
                <Image
                  source={assets.trendUpIconBlack}
                  style={styles.viewsIcon}
                  resizeMode="contain"
                />
                <PoppinsText style={styles.metricValue}>
                  {storeData.views}
                </PoppinsText>
              </View>
              <View style={styles.metricItem}>
                <Image
                  source={assets.commentsIconBlack}
                  style={styles.viewsIcon}
                  resizeMode="contain"
                />
                <PoppinsText style={styles.metricValue}>
                  {storeData.comments}
                </PoppinsText>
              </View>
              <View style={styles.metricItem}>
                <Image
                  source={assets.bookmarksIconBlack}
                  style={styles.viewsIcon}
                  resizeMode="contain"
                />
                <PoppinsText style={styles.metricValue}>
                  {storeData.bookmarks}
                </PoppinsText>
              </View>
            </View>
          </View>

          {/* Store Information Section */}
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <PoppinsText style={styles.infoLabel}>Category:</PoppinsText>
              <PoppinsText style={styles.infoValue}>
                {storeData.category}
              </PoppinsText>
            </View>
            <View style={styles.infoRow}>
              <PoppinsText style={styles.infoLabel}>Ratings:</PoppinsText>
              <PoppinsText style={styles.infoValue}>
                {storeData.ratings}
              </PoppinsText>
            </View>
            <View style={styles.infoRow}>
              <PoppinsText style={styles.infoLabel}>Opening Time:</PoppinsText>
              <PoppinsText style={styles.infoValue}>
                {storeData.openingTime}
              </PoppinsText>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <PoppinsText style={styles.infoLabel}>Closing Time:</PoppinsText>
              <PoppinsText style={styles.infoValue}>
                {storeData.closingTime}
              </PoppinsText>
            </View>
            <View
              style={[
                styles.infoRow,
                {
                  borderTopWidth: 1,
                  borderTopColor: COLORS.textInputBorder,
                  marginVertical: hp(2),
                  borderBottomWidth: 1,
                  paddingVertical: hp(2),
                },
              ]}
            >
              <PoppinsText style={styles.infoLabel}>
                Store Availability:
              </PoppinsText>
              <Switch
                value={isStoreAvailable}
                onValueChange={toggleStoreAvailability}
                trackColor={{ false: COLORS.gray, true: COLORS.blueLight2 }}
                thumbColor={isStoreAvailable ? COLORS.blue : COLORS.gray}
              />
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <PoppinsText style={styles.sectionTitle} weight="bold">
              Description
            </PoppinsText>
            <PoppinsText style={styles.description}>
              {showFullDescription
                ? storeData.description
                : `${storeData.description?.substring(0, 120)}...`}
              {!showFullDescription &&
                storeData.description &&
                storeData.description.length > 120 && (
                  <Text
                    style={styles.readMore}
                    onPress={() => setShowFullDescription(true)}
                  >
                    {' Read More'}
                  </Text>
                )}
              {showFullDescription && (
                <Text
                  style={styles.readMore}
                  onPress={() => setShowFullDescription(false)}
                >
                  {' Read Less'}
                </Text>
              )}
            </PoppinsText>
          </View>

          {/* Graph Section */}
          <View style={styles.section}>
            <View style={styles.graphContainer}>
              {graphData.map((point, index) => {
                const height = (point.value / maxValue) * graphHeight;
                const width = wp(90) / graphData.length;
                return (
                  <View key={index} style={styles.graphBarContainer}>
                    <View
                      style={[
                        styles.graphBar,
                        {
                          height: height,
                          width: width - wp(2),
                        },
                      ]}
                    />
                    <PoppinsText style={styles.graphLabel}>
                      {point.label}
                    </PoppinsText>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Tags Section */}
          <View style={styles.section}>
            <PoppinsText style={styles.sectionTitle} weight="bold">
              Tags
            </PoppinsText>
            <View style={styles.tagsContainer}>
              {storeData.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <PoppinsText style={styles.tagText}>{tag}</PoppinsText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButtonFooter}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <PoppinsText style={styles.backButtonText} weight="medium">
            Back To Home
          </PoppinsText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButtonFooter}
          onPress={() =>
            navigation.navigate('BusinessProfileSetup', { editBusiness: store })
          }
        >
          <PoppinsText style={styles.editButtonText} weight="medium">
            Edit Store
          </PoppinsText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingTop: hp(5),
    paddingBottom: hp(3),
  },
  backButton: {
    padding: wp(1),
  },
  placeholder: {
    width: wp(6),
  },
  headerTitle: {
    fontSize: hp(2.2),
    color: COLORS.black,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  contentContainer: {
    alignItems: 'center',
  },
  restaurantImage: {
    width: wp(40),
    height: hp(25),
    alignSelf: 'center',
    borderRadius: hp(1.5),
    marginBottom: hp(2),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  restaurantInfo: {
    marginBottom: hp(2),
    alignSelf: 'center',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: hp(2.5),
    color: COLORS.black,
    marginBottom: hp(0.5),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  locationPinIconBlack: {
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
  },
  address: {
    fontSize: hp(1.5),
    color: COLORS.darkGray,
    marginLeft: wp(2),
  },
  metricsContainer: {
    flexDirection: 'row',
    width: wp(50),
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
    gap: wp(1),
  },
  viewsIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
    padding: 10,
  },
  metricValue: {
    fontSize: hp(1.5),
    color: COLORS.black,
  },
  section: {
    marginBottom: hp(3),
    width: wp(90),
  },
  sectionTitle: {
    fontSize: hp(2),
    color: COLORS.black,
    marginBottom: hp(1.5),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(0.5),
    borderBottomColor: COLORS.textInputBorder,
  },
  infoLabel: {
    fontSize: hp(1.6),
    color: COLORS.black,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: hp(1.6),
    color: COLORS.darkGray,
  },
  description: {
    fontSize: hp(1.6),
    color: COLORS.darkGray,
    lineHeight: hp(2.5),
  },
  readMore: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: hp(15),
    paddingVertical: hp(2),
  },
  graphBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  graphBar: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: hp(0.5),
    borderTopRightRadius: hp(0.5),
    opacity: 0.8,
  },
  graphLabel: {
    fontSize: hp(1.2),
    color: COLORS.darkGray,
    marginTop: hp(0.5),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  tag: {
    backgroundColor: '#F7F8F9',
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: hp(1.5),
    marginBottom: hp(0.5),
  },
  tagText: {
    fontSize: hp(1.5),
    color: COLORS.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor: COLORS.white,
  },
  backButtonFooter: {
    flex: 1,
    backgroundColor: COLORS.textInputBg,
    borderColor: COLORS.textInputBorder,
    borderWidth: 1,
    borderRadius: hp(1),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginRight: wp(2),
  },
  backButtonText: {
    fontSize: hp(1.8),
    color: COLORS.black,
  },
  editButtonFooter: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: hp(1),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginLeft: wp(2),
  },
  editButtonText: {
    fontSize: hp(1.8),
    color: COLORS.white,
  },
});

export default BusinessStoreDetails;
