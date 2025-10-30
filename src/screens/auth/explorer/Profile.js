import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground, PoppinsText, Icon } from '../../../components';
import { COLORS } from '../../../constants';
import { hp, wp } from '../../../utils/responsive';
import assets from '../../../assets';
import { logoutUser } from '../../../store/slices/authSlice';
import { useAppDispatch } from '../../../hooks';
export default function Profile({ navigation }) {
  const dispatch = useAppDispatch();
  const handleBack = () => navigation?.goBack?.();
  function logout() {
    dispatch(logoutUser());
    navigation.replace('UnAuthNavigator');
  }
  const ListRow = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconWrap}>
          <Image source={icon} style={styles.rowIcon} />
        </View>
        <PoppinsText style={styles.rowText} weight="regular">
          {label}
        </PoppinsText>
      </View>
      <Icon
        name="chevron-forward"
        size={18}
        color={COLORS.darkGray}
        family="ionicons"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <GradientBackground colors={[COLORS.primary, COLORS.secondary]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Image source={assets.backChevron} style={styles.backBtn} />
          </TouchableOpacity>
          <PoppinsText style={styles.headerTitle} weight="bold">
            Settings
          </PoppinsText>
          <View style={{ width: wp(8) }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.profileCard} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <Image source={assets.profile} style={styles.avatarImage} />
            </View>
            <View style={styles.profileInfo}>
              <PoppinsText style={styles.profileName} weight="bold">
                John Smith
              </PoppinsText>
              <PoppinsText style={styles.profileSubtitle}>
                Show Profile
              </PoppinsText>
            </View>
            <Image source={assets.backChevron} style={styles.backBtn} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.ctaCard} activeOpacity={0.85}>
            <PoppinsText style={styles.ctaTitle} weight="bold">
              Create Business Account
            </PoppinsText>
            <PoppinsText style={styles.ctaSubtitle}>
              Switch To Business Account Right Away
            </PoppinsText>
          </TouchableOpacity>

          <PoppinsText style={styles.sectionTitle} weight="medium">
            General
          </PoppinsText>
          <View style={styles.card}>
            <ListRow
              icon={assets.shieldIcon}
              label="Login and security"
              onPress={() => {}}
            />
            <View style={styles.separator} />
            <ListRow
              icon={assets.privacyIcon}
              label="Privacy and sharing"
              onPress={() => {}}
            />
            <View style={styles.separator} />
            <ListRow
              icon={assets.referIcon}
              label="Refer a Friend"
              onPress={() => {}}
            />
            <View style={styles.separator} />
            <ListRow
              icon={assets.notificationBellIcon}
              label="Notification"
              onPress={() => {}}
            />
          </View>

          <PoppinsText style={styles.sectionTitle} weight="bold">
            Support
          </PoppinsText>
          <View style={styles.card}>
            <ListRow
              icon={assets.helpCenterIcon}
              label="Visit the Help Center"
              onPress={() => {}}
            />
            <View style={styles.separator} />
            <ListRow
              icon={assets.helpIcon}
              label="Get Help"
              onPress={() => {}}
            />
            <View style={styles.separator} />
            <ListRow
              icon={assets.privacyPolicyIcon}
              label="Privacy Policy"
              onPress={() => {}}
            />
          </View>

          <TouchableOpacity
            style={styles.logoutCard}
            activeOpacity={0.85}
            onPress={logout}
          >
            <View style={styles.logoutLeft}>
              <View style={styles.logoutIconWrap}>
                <Image source={assets.logoutIcon} style={styles.logoutIcon} />
              </View>
              <PoppinsText style={styles.logoutText} weight="medium">
                Log Out
              </PoppinsText>
            </View>
          </TouchableOpacity>

          <View style={{ height: hp(8) }} />
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
  },
  backBtn: {
    width: wp(3),
    height: wp(3),
    resizeMode: 'contain',
    padding: wp(1),
    transform: [{ rotate: '180deg' }],
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: hp(2.6),
  },
  content: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: wp(12),
    height: wp(12),
    resizeMode: 'contain',
  },

  profileInfo: {
    flex: 1,
    height: hp(5),
    alignSelf: 'center',
  },
  profileName: {
    color: COLORS.white,
    fontSize: hp(1.8),
  },
  profileSubtitle: {
    color: COLORS.white,
    fontSize: hp(1.4),
  },
  ctaCard: {
    backgroundColor: COLORS.white,
    padding: wp(4),
    borderRadius: wp(3.5),
    marginTop: hp(2),
  },
  ctaTitle: {
    color: COLORS.primary,
    fontSize: hp(2.1),
  },
  ctaSubtitle: {
    color: COLORS.primary,
    fontSize: hp(1.6),
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: hp(2),
    marginTop: hp(2.5),
    marginBottom: hp(1),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: wp(3.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  rowIconWrap: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(2.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  rowText: {
    color: COLORS.primary,
    fontSize: hp(1.9),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.gray,
  },
  logoutCard: {
    backgroundColor: COLORS.white,
    borderRadius: wp(3.5),
    marginTop: hp(2.5),
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(4),
  },
  logoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  logoutIconWrap: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(2.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  logoutText: {
    color: COLORS.textColorPr,
    fontSize: hp(1.9),
  },
});
