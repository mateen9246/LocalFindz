import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { PoppinsText, Icon } from '../../../components';
import { COLORS } from '../../../constants';
import assets from '../../../assets';
import { hp, wp } from '../../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function StoreDetails({ route, navigation }) {
  const { id } = route.params;
  useEffect(() => {
    getStoreDetails();
  }, []);

  const [selectedDay, setSelectedDay] = useState('Thu');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const operatingHours = '9:00AM - 11:00PM';

  const comments = [
    {
      id: 1,
      user: 'Alli Shb',
      date: '26, Oct',
      comment:
        'Lorem Ipsum Dolor Sit Amet Consectetur. Eget Tincidunt Duis Pharetra N',
      replies: [
        {
          id: 2,
          user: 'Alli Shb',
          date: '26, Oct',
          comment: 'Reply to the comment',
          isReply: true,
        },
      ],
    },
    {
      id: 3,
      user: 'Alli Shb',
      date: '26, Oct',
      comment: 'Another comment from the same user',
      replies: [],
    },
  ];

  function getStoreDetails() {
    console.log('getStoreDetails', id);
  }
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery Section */}
        <View style={styles.imageSection}>
          <Image source={assets.hotel} style={styles.mainImage} />

          {/* Navigation Arrow */}
          <TouchableOpacity style={styles.navArrow}>
            <Image source={assets.backChevron} style={styles.backChevron} />
          </TouchableOpacity>

          {/* Bookmark Button */}
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Image
              source={assets.bookmarksIconWhite}
              style={styles.backChevron}
            />
          </TouchableOpacity>
        </View>

        {/* Restaurant Information Section */}
        <View style={styles.infoSection}>
          <PoppinsText style={styles.restaurantName}>
            Kayu Lama Restaurant
          </PoppinsText>

          <View style={styles.addressContainer}>
            <Image
              source={assets.locationPinIconWhite}
              style={styles.locationPinIconWhite}
            />
            <PoppinsText style={styles.address}>
              No.5 Jalan Karang Kembar, England
            </PoppinsText>
          </View>

          <PoppinsText style={styles.description}>
            Lorem ipsum dolor sit amet consectetur. Eget tincidunt duis pharetra
            nunc tristique purus. Cursus pretium odio ipsum feugiat. Sagittis
            dui nibh ac tincidunt et. Fusce mattis etiam purus tempus at... Read
            More
          </PoppinsText>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Image source={assets.distanceIcon} style={styles.distanceIcon} />
              <PoppinsText style={styles.infoText}>3 miles away</PoppinsText>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoItem}>
              <Image source={assets.ratingIcon} style={styles.distanceIcon} />
              <PoppinsText style={styles.infoText}>4.9 Rating</PoppinsText>
            </View>

            <View style={styles.separator} />
            <View style={styles.infoItem}>
              <Image
                source={assets.timeIconWhite}
                style={styles.distanceIcon}
              />
              <PoppinsText style={styles.infoText}>9:00am-11:00pm</PoppinsText>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        {/* Owner Information Section */}
        <View style={styles.ownerSection}>
          <Image source={assets.profile} style={styles.ownerImage} />
          <View style={styles.ownerInfo}>
            <PoppinsText style={styles.ownerName}>John Smith</PoppinsText>
            <PoppinsText style={styles.ownerTitle}>owner</PoppinsText>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Image
                source={assets.commentsIconWhite}
                style={styles.commentsIconWhite}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Image
                source={assets.phoneIconWhite}
                style={styles.commentsIconWhite}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Operating Hours Section */}
        <View style={styles.hoursSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.daysScrollView}
          >
            {days.map(day => (
              <TouchableOpacity
                key={day}
                style={styles.dayButton}
                onPress={() => setSelectedDay(day)}
              >
                <ImageBackground
                  source={assets.bookmarkBg}
                  style={styles.bookmarkBg}
                  resizeMode="contain"
                  imageStyle={{ opacity: selectedDay != day ? 0.5 : 1 }}
                >
                  <PoppinsText
                    style={[
                      styles.dayText,
                      selectedDay === day && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </PoppinsText>
                </ImageBackground>
                <PoppinsText
                  style={[
                    styles.hoursText,
                    selectedDay === day && styles.selectedHoursText,
                  ]}
                >
                  {operatingHours.split(' - ')[0]}
                  {'\n'}
                  {operatingHours.split(' - ')[1]}
                </PoppinsText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapPreview}>
            <Image source={assets.mapIcon} style={styles.mapImage} />
          </View>

          <TouchableOpacity style={styles.viewMapButton}>
            <PoppinsText style={styles.viewMapText}>View on Map</PoppinsText>
            <Image source={assets.backChevron} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <PoppinsText style={styles.commentsTitle}>Comments</PoppinsText>

          {comments.map(comment => (
            <View key={comment.id} style={styles.commentContainer}>
              <View style={styles.commentHeader}>
                <Image
                  source={assets.profile}
                  style={styles.commentUserImage}
                />
              </View>

              {comment.replies.length > 0 && (
                <View style={styles.commentContent}>
                  <Text style={styles.commentContentText}>{'>'}</Text>
                </View>
              )}
              <View>
                <PoppinsText style={styles.commentUserName}>
                  {comment.user}
                  <PoppinsText style={styles.commentDate}>
                    {' '}
                    - {comment.date}
                  </PoppinsText>
                </PoppinsText>
                <PoppinsText style={styles.commentText}>
                  {comment.comment}
                </PoppinsText>
                <TouchableOpacity>
                  <PoppinsText style={styles.replyText}>Reply</PoppinsText>
                </TouchableOpacity>
                {comment.replies.map(reply => (
                  <View>
                    <View
                      style={[
                        styles.commentHeader,
                        { marginTop: hp(2), marginLeft: wp(2) },
                      ]}
                    >
                      <Image
                        source={assets.profile}
                        style={styles.commentUserImage}
                      />
                      <PoppinsText style={styles.commentUserName}>
                        {reply.user}
                        <PoppinsText style={styles.commentDate}>
                          {' '}
                          - {reply.date}
                        </PoppinsText>
                      </PoppinsText>
                    </View>
                    <PoppinsText
                      style={[
                        styles.commentText,
                        { marginTop: hp(1), marginLeft: wp(2) },
                      ]}
                    >
                      {reply.comment}
                    </PoppinsText>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: wp(4),
                      }}
                    >
                      <TouchableOpacity style={{ marginLeft: wp(2) }}>
                        <PoppinsText style={styles.replyText}>
                          Reply
                        </PoppinsText>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: wp(2) }}>
                        <PoppinsText style={styles.replyText}>
                          See Transalation
                        </PoppinsText>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp(5),
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    marginTop: hp(5),
    height: hp(25),
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: hp(2),
  },
  navArrow: {
    position: 'absolute',
    left: wp(5),
    top: hp(2),
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backChevron: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  bookmarkButton: {
    position: 'absolute',
    right: wp(5),
    top: hp(2),
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    paddingVertical: hp(2),
  },
  restaurantName: {
    fontSize: hp(2),
    fontFamily: 'Poppins-Bold',
    color: COLORS.white,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  locationPinIconWhite: {
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
  },
  address: {
    fontSize: hp(1.6),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
    marginLeft: wp(2),
  },
  description: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
    marginBottom: hp(2),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  infoText: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
    marginLeft: wp(1),
  },
  separator: {
    width: wp(0.2),
    height: hp(2),
    backgroundColor: COLORS.white,
    marginHorizontal: wp(2),
  },
  divider: {
    height: hp(0.1),
    backgroundColor: COLORS.secondary,
    marginBottom: hp(2),
  },
  ownerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  ownerImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(12),
    marginRight: wp(4),
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: hp(2),
    fontFamily: 'Poppins-Bold',
    color: COLORS.white,
  },
  ownerTitle: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(2),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  commentsIconWhite: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },
  hoursSection: {
    marginBottom: hp(2),
  },
  daysScrollView: {
    flexDirection: 'row',
  },
  bookmarkBg: {
    width: wp(11),
    height: wp(11),
    padding: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButton: {
    marginRight: wp(2),
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  dayText: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.primary,
  },
  selectedDayText: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.primary,
  },
  hoursText: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: hp(2),
    opacity: 0.5,
    marginTop: hp(1),
  },
  selectedHoursText: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: hp(2),
    opacity: 1,
    marginTop: hp(1),
  },
  mapSection: {
    marginBottom: hp(2),
    elevation: 5,
    shadowColor: COLORS.black,
    backgroundColor: COLORS.primary,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: hp(2),
    borderRadius: hp(2),
  },
  mapPreview: {
    height: hp(18),
    backgroundColor: COLORS.white,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: hp(2),
    borderTopRightRadius: hp(2),
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: hp(2),
  },
  viewMapButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp(1.7),
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: hp(2),
    borderBottomRightRadius: hp(2),
  },
  viewMapText: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
    marginRight: wp(5),
  },
  arrowIcon: {
    transform: [{ rotate: '180deg' }],
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
  },
  commentsSection: {
    paddingBottom: hp(5),
  },
  commentsTitle: {
    fontSize: hp(2),
    fontFamily: 'Poppins-Bold',
    color: COLORS.white,
    marginBottom: hp(2),
    width: wp(28),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  commentContainer: {
    marginBottom: hp(2),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentContent: {
    position: 'absolute',
    left: wp(5),
    top: hp(4.2),
    zIndex: -1,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.white,
    borderBottomWidth: 1,
    borderBlockColor: COLORS.white,
    borderBottomLeftRadius: hp(1),
    height: hp(10),
    width: wp(7),
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  commentContentText: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
    lineHeight: hp(2),
    marginBottom: -hp(1.1),
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  commentUserName: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Bold',
    color: COLORS.white,
  },
  commentDate: {
    fontSize: hp(1.2),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
    opacity: 0.7,
  },
  commentText: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Regular',
    color: COLORS.white,
    lineHeight: hp(2),
  },

  replyText: {
    fontSize: hp(1.4),
    fontFamily: 'Poppins-Medium',
    color: COLORS.white,
    opacity: 0.8,
    marginTop: hp(1),
  },
});
