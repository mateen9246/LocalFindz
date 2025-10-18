import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import { COLORS } from '../../../constants';
import { PoppinsText, Icon } from '../../../components';
import assets from '../../../assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsive';
import { useIsFocused } from '@react-navigation/native';
import { COLLECTIONS, firebaseService } from '../../../services';

const Dashboard = ({ navigation, route }) => {
  const { businesses } = route.params || [];
  const isFocused = useIsFocused();

  useEffect(async () => {
    (async () => {
      if (businesses && businesses.length == 0) {
        const data = await firebaseService.queryCollection(
          COLLECTIONS.BUSINESSES,
          'userId',
          '==',
          firebaseService.getCurrentUser().uid,
        );
        setStores(data.docs.map(doc => doc.data()));
      }
    })();
  }, [isFocused]);
  const [selectedLocation, setSelectedLocation] = useState('Birmingham');
  const [searchText, setSearchText] = useState('');
  const [stores, setStores] = useState(businesses || []);
  const [analyticsData, setAnalyticsData] = useState([
    {
      id: 1,
      title: 'Total Stores',
      value: '12',
      change: '+25.3',
      changeType: 'positive',
      icon: assets.purpleStoreIcon,
      color: COLORS.primaryLight,
      iconBg: COLORS.primaryLight2,
    },
    {
      id: 2,
      title: 'Total Views',
      value: '35.6k',
      change: '+25.3',
      changeType: 'positive',
      icon: assets.viewsIcon,
      color: COLORS.greenLight,
      iconBg: COLORS.greenLight2,
    },
    {
      id: 3,
      title: 'Comments',
      value: '5.6k',
      change: '+25.3',
      changeType: 'positive',
      icon: assets.commentsIcon,
      color: COLORS.orangeLight,
      iconBg: COLORS.orangeLight2,
    },
    {
      id: 4,
      title: 'Bookmarks',
      value: '3.2k',
      change: '-25.3',
      changeType: 'negative',
      icon: assets.bookmarksIcon,
      color: COLORS.blueLight,
      iconBg: COLORS.blueLight2,
    },
  ]);
  const renderAnalyticsCard = item => (
    <View
      key={item.id}
      style={[styles.analyticsCard, { backgroundColor: item.color }]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.cardIcon,
            { backgroundColor: item.iconBg, opacity: 0.3 },
          ]}
        />
        <Image
          source={item.icon}
          style={styles.cardIconImage}
          resizeMode="contain"
        />
        <PoppinsText style={styles.cardTitle}>{item.title}</PoppinsText>
      </View>
      <View style={styles.changeContainer}>
        <PoppinsText style={styles.cardValue}>{item.value}</PoppinsText>
        <View style={[styles.changeContainer, { marginTop: 0 }]}>
          <Image
            source={
              item.changeType === 'positive'
                ? assets.trendingUpIcon
                : assets.trendingDownIcon
            }
            style={styles.changeIcon}
            resizeMode="contain"
          />
          <PoppinsText
            style={[
              styles.changeText,
              {
                color:
                  item.changeType === 'positive' ? COLORS.green : COLORS.orange,
              },
            ]}
          >
            {item.change}
          </PoppinsText>
        </View>
      </View>
    </View>
  );

  const renderStoreCard = store => (
    <View key={store?.id} style={styles.storeCard}>
      <Image source={assets.storeImage} style={styles.storeImage} />
      <View style={styles.storeInfo}>
        <PoppinsText style={styles.storeName}>
          {store?.businessName || 'N/A'}
        </PoppinsText>
        <PoppinsText style={styles.storeAddress} numberOfLines={1}>
          {store?.address || 'No.5 Jalan Karang Kembar...'}
        </PoppinsText>
        <View style={styles.storeStats}>
          <View style={styles.statItem}>
            <Image
              source={assets.trendUpIconBlack}
              style={styles.trendUpIconBlack}
              resizeMode="contain"
            />
            <PoppinsText style={styles.statText} weight="medium">
              {store?.views || '0'}
            </PoppinsText>
          </View>
          <View style={styles.statItem}>
            <Image
              source={assets.commentsIconBlack}
              style={styles.commentsIconBlack}
              resizeMode="contain"
            />
            <PoppinsText style={styles.statText} weight="medium">
              {store?.comments || '0'}
            </PoppinsText>
          </View>
          <View style={styles.statItem}>
            <Image
              source={assets.bookmarksIconBlack}
              style={styles.bookmarksIconBlack}
              resizeMode="contain"
            />
            <PoppinsText style={styles.statText} weight="medium">
              {store?.bookmarks || '0'}
            </PoppinsText>
          </View>
        </View>
      </View>
      <View style={styles.storeActions}>
        <TouchableOpacity style={styles.editButton}>
          <PoppinsText style={styles.editButtonText} weight="bold">
            Edit
          </PoppinsText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Image
            source={assets.deleteStoreIcon}
            style={styles.deleteStoreIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <View style={styles.locationLabelContainer}>
            <Image
              source={assets.locationPinIcon}
              style={styles.locationPinIcon}
              resizeMode="contain"
            />
            <PoppinsText style={styles.locationLabel}>Location</PoppinsText>
          </View>
          <TouchableOpacity style={styles.locationSelector}>
            <PoppinsText style={styles.locationText} weight="bold">
              {selectedLocation}
            </PoppinsText>
            <Image
              source={assets.chevronDownIcon}
              style={styles.chevronDownIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Image source={assets.bellIcon} style={styles.bellIcon} />
        </TouchableOpacity>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image source={assets.searchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your store"
            placeholderTextColor={COLORS.darkGray}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Image source={assets.filterIcon} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stores Analytics Section */}
        <View style={styles.section}>
          <PoppinsText style={styles.sectionTitle}>
            Stores Analytics
          </PoppinsText>
          <View style={styles.analyticsGrid}>
            {analyticsData.map(renderAnalyticsCard)}
          </View>
        </View>

        {/* Listed Stores Section */}
        <View style={styles.section}>
          <PoppinsText style={styles.sectionTitle}>Listed stores</PoppinsText>
          <View style={styles.storesList}>{stores.map(renderStoreCard)}</View>
        </View>
      </ScrollView>
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
    paddingTop: hp(2),
    paddingBottom: hp(3),
  },
  locationContainer: {
    flex: 1,
  },
  locationLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  locationPinIcon: {
    width: wp(3),
    height: wp(3),
  },
  locationLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: COLORS.black,
    marginRight: wp(3),
  },
  notificationButton: {
    position: 'relative',
  },
  bellIcon: {
    width: wp(8),
    height: wp(8),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8F9',
    borderRadius: hp(1),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginRight: wp(2),
  },
  searchIcon: {
    width: wp(5),
    height: wp(5),
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(3),
    fontSize: hp(1.8),
    color: COLORS.black,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    borderRadius: hp(1),
    padding: hp(2),
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: hp(2),
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsCard: {
    width: '48%',
    borderRadius: hp(1),
    padding: hp(2),
    marginBottom: wp(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  cardIcon: {
    width: wp(5),
    height: wp(5),
    padding: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(0.5),
  },
  cardIconImage: {
    position: 'absolute',
    top: wp(2.6),
    left: wp(2.6),
  },
  cardTitle: {
    fontSize: hp(1.5),
    color: COLORS.black,
    fontFamily: 'Poppins-Medium',
    marginTop: hp(0.4),
  },
  cardValue: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: wp(2),
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: wp(1),
  },
  changeIcon: {
    width: wp(3),
    height: wp(3),
  },
  storesList: {
    gap: wp(2),
  },
  storeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: hp(1),
    padding: hp(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: hp(1),
    marginRight: wp(2),
  },
  storeInfo: {
    width: wp(40),
  },
  storeName: {
    fontSize: hp(1.8),
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: wp(1),
  },
  storeAddress: {
    fontSize: hp(1.4),
    color: COLORS.darkGray,
    marginBottom: wp(2),
  },
  storeStats: {
    flexDirection: 'row',
    gap: wp(4),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  statText: {
    fontSize: hp(1.2),
    color: COLORS.darkGray,
  },
  storeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: hp(0.2),
    width: wp(14),
    height: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: hp(1.2),
    fontWeight: '600',
    color: COLORS.primary,
  },
  deleteButton: {
    padding: wp(2),
  },
  trendUpIconBlack: {
    width: wp(4),
    height: wp(4),
  },
  commentsIconBlack: {
    width: wp(4),
    height: wp(4),
  },
  bookmarksIconBlack: {
    width: wp(4),
    height: wp(4),
  },
  deleteStoreIcon: {
    width: wp(5),
    height: wp(5),
  },
});

export default Dashboard;
