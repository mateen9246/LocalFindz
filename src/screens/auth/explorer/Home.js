import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PoppinsText, Icon, CustomTextInput } from '../../../components';
import { COLORS } from '../../../constants';
import { wp, hp } from '../../../utils/responsive';
import assets from '../../../assets';
import { useIsFocused } from '@react-navigation/native';
import { COLLECTIONS, firebaseService } from '../../../services';

export default function Home({ navigation }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categorySelected, setCategorySelected] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  async function fetchRecommendations() {
    setIsLoading(true);
    const data = await firebaseService.getCollection(
      COLLECTIONS.BUSINESSES,
      10,
    );
    setRecommendations(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setIsLoading(false);
  }
  useEffect(() => {
    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (!!categorySelected) {
      async function fetchCategoryRecommendations() {
        const data = await firebaseService.queryCollection(
          COLLECTIONS.BUSINESSES,
          'tags',
          'array-contains',
          categorySelected,
        );
        setRecommendations(
          data.docs.map(doc => ({ ...doc.data(), id: doc.id })),
        );
      }
      fetchCategoryRecommendations();
    } else {
      fetchRecommendations();
    }
  }, [categorySelected]);

  async function filterSearchRecommendations() {
    const data = await firebaseService.queryCollection(
      COLLECTIONS.BUSINESSES,
      'businessName',
      '==',
      searchQuery,
    );
    setRecommendations(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setIsLoading(false);
  }

  const categories = [
    {
      id: 1,
      name: 'Stay',
      image: assets.stayIcon,
    },
    {
      id: 2,
      name: 'Food',
      image: assets.foodIcon,
    },
    {
      id: 3,
      name: 'Shops',
      image: assets.shopIconPrimary,
    },
    {
      id: 4,
      name: 'Parks',
      image: assets.parkIcon,
    },
    {
      id: 5,
      name: 'Services',
      image: assets.serviceIcon,
    },
  ];
  function renderListRecommendationItem({ item }) {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.recommendationCard}
        onPress={() => navigation.navigate('StoreDetails', { id: item.id })}
      >
        <Image source={assets.hotel} style={styles.cardImage} />
        <TouchableOpacity style={styles.bookmarkButton}>
          <Icon
            name={item.isBookmarked ? 'bookmark' : 'bookmark-o'}
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <PoppinsText style={styles.cardTitle}>
            {item.businessName || 'N/A'}
          </PoppinsText>
          <View style={styles.cardDetails}>
            <View style={styles.cardDistanceContainer}>
              <Image
                source={assets.distanceIcon}
                resizeMethod="contain"
                style={styles.distanceIcon}
              />
              <PoppinsText style={styles.cardDistance}>
                {item.distance || 'N/A Miles Away'}
              </PoppinsText>
            </View>
            <View style={styles.cardDistanceContainer}>
              <Image
                source={assets.ratingIcon}
                resizeMethod="contain"
                style={styles.cardRatingIcon}
              />
              <PoppinsText style={styles.cardRating}>
                {item.rating || 'N/A'}
              </PoppinsText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <PoppinsText style={styles.locationLabel}>Location</PoppinsText>
            <View style={styles.locationRow}>
              <PoppinsText style={styles.locationText}>Birmingham</PoppinsText>
              <Icon name="chevron-down" size={16} color={COLORS.white} />
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell" size={24} color={COLORS.white} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <CustomTextInput
          placeholder="Search Desired place"
          containerStyle={styles.searchInputContainer}
          inputContainerStyle={{
            backgroundColor: COLORS.white,
            width: wp('70'),
          }}
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
          inputStyle={styles.searchInput}
          leftIcon={<Image source={assets.searchIcon} resizeMethod="contain" />}
          rightIcon={
            <TouchableOpacity
              style={styles.filterButton}
              onPress={filterSearchRecommendations}
            >
              <Image source={assets.filterIcon} resizeMethod="contain" />
            </TouchableOpacity>
          }
        />

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Popular Destinations */}
          <View style={styles.section}>
            <PoppinsText style={styles.sectionTitle}>
              Popular Destinations
            </PoppinsText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryButton}
                  onPress={() => {
                    if (categorySelected === category.name) {
                      setCategorySelected('');
                    } else {
                      setCategorySelected(category.name);
                    }
                  }}
                >
                  <View
                    style={[
                      styles.categoryIconContainer,
                      {
                        backgroundColor:
                          categorySelected === category.name
                            ? COLORS.secondary
                            : COLORS.white,
                      },
                    ]}
                  >
                    <Image
                      source={category.image}
                      style={styles.categoryImage}
                      resizeMethod="contain"
                    />
                  </View>
                  <PoppinsText style={styles.categoryText}>
                    {category.name}
                  </PoppinsText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Near From You */}
          <View>
            <PoppinsText
              style={[
                styles.sectionTitle,
                { marginTop: hp(-2), marginBottom: 0 },
              ]}
            >
              Near from you
            </PoppinsText>
            <FlatList
              data={recommendations}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              decelerationRate="fast"
              keyExtractor={item => item.id}
              ListEmptyComponent={
                <View style={styles.loadingComponent}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.white} />
                  ) : (
                    <PoppinsText style={styles.noRecommendationsText}>
                      No recommendations found
                    </PoppinsText>
                  )}
                </View>
              }
              style={styles.recommendationsScroll}
              renderItem={renderListRecommendationItem}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    marginTop: hp(3),
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: hp(1.6),
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: hp(0.3),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  locationText: {
    fontSize: hp(2.4),
    color: COLORS.white,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: wp(2),
  },
  notificationDot: {
    position: 'absolute',
    top: wp(1.5),
    right: wp(1.5),
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: COLORS.danger,
  },
  searchInputContainer: {
    alignSelf: 'flex-start',
    marginLeft: wp(5),
    borderRadius: hp(2),
    marginVertical: hp(2),
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    borderRadius: wp(2),
    height: hp(7),
    width: wp(17),
    position: 'absolute',
    right: wp(-24),
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
  searchInput: {
    borderRadius: wp(3),
    fontSize: hp(1.8),
    color: COLORS.textColorPr,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: hp(2.5),
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  categoriesScroll: {
    marginHorizontal: -wp(5),
    paddingHorizontal: wp(5),
  },
  categoryButton: {
    alignItems: 'center',
    width: wp(25),
  },
  categoryIconContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryImage: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: hp(1.6),
    color: COLORS.white,
    fontWeight: 'medium',
    textAlign: 'center',
  },
  loadingComponent: {
    width: wp(90),
    height: hp(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRecommendationsText: {
    fontSize: hp(2),
    color: COLORS.white,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  recommendationsScroll: {
    marginHorizontal: -wp(5),
    paddingHorizontal: wp(5),
  },
  recommendationCard: {
    width: wp(70),
    height: hp(50),
    marginRight: wp(4),
    backgroundColor: 'transparent',
    borderRadius: wp(4),
  },
  cardImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  bookmarkButton: {
    position: 'absolute',
    top: wp(3),
    right: wp(3),
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: wp(2),
    padding: wp(2),
  },
  cardContent: {
    position: 'absolute',
    bottom: hp(4),
  },
  cardTitle: {
    fontSize: hp(2),
    color: COLORS.white,
    fontFamily: 'Poppins-Medium',
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    justifyContent: 'center',
  },
  cardDistance: {
    fontSize: hp(1.6),
    color: COLORS.white,
    fontFamily: 'Poppins-Regular',
  },
  cardRating: {
    fontSize: hp(1.6),
    color: COLORS.white,
    fontFamily: 'Poppins-Regular',
  },
  distanceIcon: {
    width: wp(7),
    height: wp(7),
    resizeMode: 'contain',
  },
  cardRatingIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
});
