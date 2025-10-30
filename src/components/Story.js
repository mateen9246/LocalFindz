import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { hp, wp } from '../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants';
import PoppinsText from './PoppinsText';
import assets from '../assets';
import { handleBookmark, fetchUserBookmarks } from '../services/bookmark';
import Icon from './Icon';

// const usersStories = [
//   {
//     userId: '1',
//     username: 'VadimNotJustDev',
//     stories: [
//       {
//         uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/1.jpg',
//       },
//       // {
//       //   uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/2.jpg',
//       // },
//       // {
//       //   uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/3.jpg',
//       // },
//     ],
//   },
//   {
//     userId: '2',
//     username: 'Elon',
//     stories: [
//       {
//         uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/4.jpeg',
//       },
//       {
//         uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/5.jpg',
//       },
//       {
//         uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/6.jpg',
//       },
//     ],
//   },
//   {
//     userId: '3',
//     username: 'Alex',
//     stories: [
//       {
//         uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/3.jpg',
//       },
//       {
//         uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/6.jpg',
//       },
//       {
//         uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/7.jpg',
//       },
//     ],
//   },
// ];

const storyViewDuration = 5 * 1000;

export default function Story({ stories }) {
  useEffect(() => {
    fetchBookmarks();
  }, []);
  const usersStories = stories;
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userIndex, setUserIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);

  async function fetchBookmarks() {
    const bookmarks = await fetchUserBookmarks();
    setUserBookmarks(bookmarks);
  }
  const progress = useSharedValue(0); // 0 -> 1

  const user = usersStories[userIndex];
  const story = user.stories[storyIndex];
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: storyViewDuration,
      easing: Easing.linear,
    });
  }, [storyIndex, userIndex]);

  const goToPrevStory = () => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: storyViewDuration,
      easing: Easing.linear,
    });
    setStoryIndex(index => {
      if (index === 0) {
        goToPrevUser();
        return 0;
      }
      return index - 1;
    });
  };

  const goToNextStory = () => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: storyViewDuration,
      easing: Easing.linear,
    });
    setStoryIndex(index => {
      if (index === user.stories.length - 1) {
        goToNextUser();
        return 0;
      }
      return index + 1;
    });
  };

  const goToNextUser = () => {
    setUserIndex(index => {
      if (index === usersStories.length - 1) {
        return 0;
      }
      return index + 1;
    });
  };

  const goToPrevUser = () => {
    setUserIndex(index => {
      if (index === 0) {
        return usersStories.length - 1;
      }
      return index - 1;
    });
  };

  useAnimatedReaction(
    () => progress.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue === 1) {
        runOnJS(goToNextStory)();
      }
    },
  );

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));
  return (
    <Pressable
      style={styles.storyContainer}
      onPressIn={() => (progress.value = withTiming(progress.value))}
      onPressOut={() => {
        progress.value = withTiming(1, {
          duration: storyViewDuration,
          easing: Easing.linear,
        });
      }}
    >
      <LinearGradient
        style={styles.overlay}
        pointerEvents="none"
        colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1.5 }}
      />

      <Image source={{ uri: story.images[0] }} style={styles.image} />
      <Pressable style={styles.navPressable} onPress={goToPrevStory} />
      <Pressable
        style={[styles.navPressable, { right: 0 }]}
        onPress={goToNextStory}
      />

      <View style={styles.header}>
        <View style={styles.indicatorRow}>
          {user.stories.map((story, index) => (
            <View key={`${user.userId}-${index}`} style={styles.indicatorBG}>
              <Animated.View
                style={[
                  styles.indicator,
                  index === storyIndex && indicatorAnimatedStyle,
                  index > storyIndex && { width: 0 },
                  index < storyIndex && { width: '100%' },
                ]}
              />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.indicatorTextContainer}>
        <PoppinsText style={styles.indicatorText}>
          {story.businessName || 'N/A'}
        </PoppinsText>
        <View style={styles.locationTextView}>
          <Image
            source={assets.locationPinIconWhite}
            style={styles.locationIcon}
          />
          <PoppinsText style={styles.locationText} weight="regular">
            {story.address || 'N/A'}
          </PoppinsText>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.cardDistanceContainer}>
            <Image
              source={assets.distanceIcon}
              resizeMethod="contain"
              style={styles.distanceIcon}
            />
            <PoppinsText style={styles.cardDistance}>
              {story.distance || 'N/A Miles Away'}
            </PoppinsText>
          </View>
          <View style={styles.cardDistanceContainer}>
            <Image
              source={assets.ratingIcon}
              resizeMethod="contain"
              style={styles.cardRatingIcon}
            />
            <PoppinsText style={styles.cardRating}>
              {story.rating || 'N/A'}
            </PoppinsText>
          </View>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity onPress={null}>
            <Image source={assets.backRoundIcon} style={styles.smallIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={null}>
            <Image source={assets.messageIcon} style={styles.bigIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={null}>
            <Image source={assets.starIcon} style={styles.smallIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleBookmark(story, userBookmarks, async () => {
                setUserBookmarks(await fetchUserBookmarks());
              });
            }}
          >
            {!!userBookmarks.find(
              bookmark => bookmark.storeId === story.id,
            ) && (
              <Icon
                name="heart"
                size={24}
                color={COLORS.white}
                style={{
                  position: 'absolute',
                  top: hp(2.7),
                  left: wp(6.1),
                  right: 0,
                  bottom: 0,
                  zIndex: 100,
                }}
              />
            )}
            <Image source={assets.likeIcon} style={styles.bigIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={null}>
            <Image source={assets.boostIcon} style={styles.smallIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  storyContainer: {
    width: wp(90),
    height: hp(78),
    alignSelf: 'center',
    borderRadius: hp(2),
    marginTop: hp(1),
    // flex: 1,
  },
  overlay: {
    flex: 1,
    // opacity: 0.1,
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: hp(2),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: hp(2),
  },
  header: {
    width: '100%',
    position: 'absolute',
    paddingTop: 10,
    borderTopEndRadius: hp(2),
    borderTopStartRadius: hp(2),
  },
  navPressable: {
    position: 'absolute',
    width: '30%',
    height: '100%',
  },
  indicatorRow: {
    gap: 5,
    flexDirection: 'row',
    paddingHorizontal: wp(2),
    marginBottom: hp(2),
  },
  indicatorBG: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  indicator: {
    backgroundColor: 'white',
    height: '100%',
  },
  indicatorTextContainer: {
    bottom: hp(10),
    zIndex: 100,
    position: 'absolute',
    paddingHorizontal: wp(5),
  },
  indicatorText: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: COLORS.white,
  },
  locationTextView: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: wp(1),
    marginVertical: hp(1),
  },
  locationIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  locationText: {
    fontSize: hp(1.7),
    color: COLORS.white,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
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
  bottomButtonsContainer: {
    width: wp(80),
    height: '100%',
    marginBottom: hp(-5),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallIcon: {
    width: wp(12),
    height: wp(12),
    resizeMode: 'contain',
  },
  bigIcon: {
    width: wp(18),
    height: wp(18),
    resizeMode: 'contain',
  },
});
