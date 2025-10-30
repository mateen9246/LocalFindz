import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PoppinsText, Icon } from '../../../components';
import { COLORS } from '../../../constants';
import { wp, hp } from '../../../utils/responsive';
import Story from '../../../components/Story';
/**
 * Discover screen component for explorer users
 * Displays a swipeable card interface for discovering restaurants and places
 */
export default function Discover({ navigation }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // Sample restaurant data - to be replaced with actual data
  const restaurantData = {
    name: 'Kayu Lama Restaurant',
    address: '2345 Apple Way, San Francisco, CA 8658',
    distance: '3 Miles Away',
    rating: '4.9',
    image: null, // Placeholder - user will replace
  };

  /**
   * Handles refresh action
   */
  const handleRefresh = () => {
    // TODO: Implement refresh logic
    console.log('Refresh pressed');
  };

  /**
   * Handles chat/message action
   */
  const handleChat = () => {
    // TODO: Implement chat logic
    console.log('Chat pressed');
  };

  /**
   * Handles star/favorite action
   */
  const handleStar = () => {
    setIsStarred(!isStarred);
  };

  /**
   * Handles heart/favorite action
   */
  const handleHeart = () => {
    setIsFavorited(!isFavorited);
  };

  /**
   * Handles bookmark action
   */
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
      >
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
        <Story />
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
  cardContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(12),
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: hp(2),
    height: hp(0.3),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: hp(0.15),
    overflow: 'hidden',
  },
  progressBar: {
    flex: 1,
    height: '100%',
  },
  progressBarFilled: {
    backgroundColor: COLORS.white,
    width: '30%', // Placeholder progress
  },
  card: {
    flex: 1,
    borderRadius: wp(6),
    overflow: 'hidden',
    marginBottom: hp(3),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardImageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  cardInfoContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(3),
    paddingTop: hp(2),
  },
  restaurantName: {
    fontSize: hp(3),
    color: COLORS.white,
    marginBottom: hp(1),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.8),
  },
  infoIcon: {
    marginRight: wp(2),
  },
  infoText: {
    fontSize: hp(1.8),
    color: COLORS.white,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(3),
  },
  starIcon: {
    marginRight: wp(1.5),
  },
  ratingText: {
    fontSize: hp(1.8),
    color: COLORS.white,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(4),
  },
  actionButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButton: {
    backgroundColor: '#FFD700', // Yellow
  },
  chatButton: {
    backgroundColor: '#FF1493', // Pink/Magenta
  },
  starButton: {
    backgroundColor: '#1E90FF', // Blue
  },
  heartButton: {
    backgroundColor: '#00CED1', // Teal/Cyan
  },
  bookmarkButton: {
    backgroundColor: COLORS.primary, // Purple
  },
});
