import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { firebaseService } from '../../services/firebase';
import { CustomTextInput, CustomButton, Icon } from '../../components';
import { COLORS } from '../../constants';
import { hp, wp } from '../../utils/responsive';
import assets from '../../assets';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter an email and password');
      return;
    }
    try {
      setLoading(true);
      const result = await firebaseService.signUp({ email, password });
      if (result?.success) {
        navigation.navigate('Login');
      } else {
        Alert.alert('Sign up failed', result?.error || 'Try again.');
      }
    } catch (e) {
      Alert.alert('Sign up error', e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={assets.logoBright}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Heading */}
      <Text style={styles.heading}>
        Let’s <Text style={styles.headingBold}>Get Started</Text>
      </Text>
      <Text style={styles.subTitle}>Create your account to get started</Text>

      {/* Inputs */}
      <CustomTextInput
        containerStyle={{ marginVertical: hp(2) }}
        placeholder="Username or gmail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        leftIcon={<Image source={assets.userIcon} />}
      />

      <CustomTextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPwd}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        leftIcon={<Image source={assets.lockIcon} />}
        rightIcon={<Image source={assets.eye} />}
        onRightIconPress={() => setShowPwd(!showPwd)}
      />

      {/* CTA */}
      <CustomButton
        title="Sign Up"
        onPress={handleSignUp}
        loading={loading}
        disabled={loading}
        variant="primary"
        size="medium"
        fullWidth
        style={styles.signupButton}
      />

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.orText}>Or Sign In with</Text>
        <View style={styles.divider} />
      </View>

      {/* Social buttons (UI only for now) */}
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => {
            /* TODO: Facebook Auth */
          }}
        >
          <Image source={assets.facebookIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => {
            /* TODO: Google Auth */
          }}
        >
          <Image source={assets.googleIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => {
            /* TODO: Apple Auth */
          }}
        >
          <Image source={assets.appleIcon} />
        </TouchableOpacity>
      </View>

      {/* Footer link */}
      <Text style={styles.footerText}>
        Don’t have an account?
        <Text
          style={styles.signInLink}
          onPress={() => navigation.navigate('Login')}
        >
          {' '}
          Sign In
        </Text>
      </Text>

      {/* Purple angled shape */}
      <View style={styles.bottomShape} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingTop: hp(8),
  },
  logo: {
    width: wp(40),
    height: wp(40),
    alignSelf: 'flex-start',
  },
  heading: {
    fontSize: 24,
    color: COLORS.black,
    alignSelf: 'flex-start',
  },
  headingBold: {
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    color: COLORS.gray,
    alignSelf: 'flex-start',
    marginTop: hp(0.5),
    marginBottom: hp(1.5),
  },
  signupButton: {
    marginTop: hp(2),
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(2),
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.gray,
    width: wp(90),
  },
  orText: {
    marginHorizontal: wp(2),
    fontSize: 14,
    color: COLORS.darkGray,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp(1.5),
  },
  socialButton: {
    width: wp(30),
    height: hp(7),
    borderRadius: wp(3),
    borderWidth: 0.5,
    borderColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    backgroundColor: COLORS.white,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.black,
    marginTop: hp(2),
  },
  signInLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  bottomShape: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopWidth: hp(15),
    borderRightWidth: wp(100),
    borderColor: 'transparent',
    borderTopColor: COLORS.primary,
  },
});
