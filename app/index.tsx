import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  Image,
  Dimensions,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Phone } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { validatePhone } from '@/utils/validation';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.5;
const DRAWER_SNAP_POINTS = [DRAWER_HEIGHT, SCREEN_HEIGHT * 0.8];

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAppStore();
  const drawerHeight = useSharedValue(DRAWER_HEIGHT);

  const handlePhoneSubmit = () => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Mock sending OTP
    router.push({
      pathname: '/verify',
      params: { phone }
    });
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters except +
    const cleaned = text.replace(/[^\d+]/g, '');
    setPhone(cleaned);
    setError('');
  };

  const handlePressTerms = () => {
    Linking.openURL('https://hitme.app/terms');
  };

  const handlePressPrivacy = () => {
    Linking.openURL('https://hitme.app/privacy');
  };

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(SCREEN_HEIGHT - drawerHeight.value) }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: darkTheme.background }]}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, { color: darkTheme.text.primary }]}>HitMe</Text>
      </View>

      {/* Bottom Drawer */}
      <Animated.View 
        style={[
          styles.drawer, 
          { backgroundColor: darkTheme.card },
          drawerAnimatedStyle
        ]}
      >
        <View style={styles.drawerHandle} />
        
        <View style={styles.drawerContent}>
          <Text style={[styles.title, { color: darkTheme.text.primary }]}>
            Log in / Sign up
          </Text>
          
          <Text style={[styles.subtitle, { color: darkTheme.text.secondary }]}>
            Enter your phone number to connect with friends in real-time
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={[
                styles.phoneInput, 
                { 
                  backgroundColor: darkTheme.background,
                  borderColor: error ? darkTheme.accent : darkTheme.border 
                }
              ]}>
                <Phone size={20} color={darkTheme.text.light} style={styles.icon} />
                <TextInput
                  style={[styles.input, { color: darkTheme.text.primary }]}
                  value={phone}
                  onChangeText={formatPhoneNumber}
                  placeholder="Enter phone number"
                  placeholderTextColor={darkTheme.text.light}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>
              {error ? (
                <Text style={[styles.errorText, { color: darkTheme.accent }]}>{error}</Text>
              ) : (
                <Text style={[styles.helperText, { color: darkTheme.text.light }]}>
                  Include country code (e.g. +1)
                </Text>
              )}
            </View>

            <Button
              title="Continue"
              onPress={handlePhoneSubmit}
              disabled={!phone.length}
              style={styles.button}
            />
          </View>

          <Text style={[styles.terms, { color: darkTheme.text.light }]}>
            By continuing you agree to our{' '}
            <Text 
              style={[styles.link, { color: darkTheme.primary }]}
              onPress={handlePressTerms}
            >
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text 
              style={[styles.link, { color: darkTheme.primary }]}
              onPress={handlePressPrivacy}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: DRAWER_HEIGHT,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  drawerHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 24,
  },
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  errorText: {
    fontSize: 14,
    marginLeft: 16,
  },
  helperText: {
    fontSize: 14,
    marginLeft: 16,
  },
  button: {
    height: 56,
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  link: {
    textDecorationLine: 'underline',
  },
});