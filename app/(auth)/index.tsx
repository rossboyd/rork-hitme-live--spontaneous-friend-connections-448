import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { hasCompletedOnboarding } = useOnboardingStore();
  const { colors = darkTheme } = useThemeStore();
  
  // Check if user is already authenticated and onboarded
  useEffect(() => {
    if (isLoggedIn && hasCompletedOnboarding) {
      router.replace('/(tabs)');
    } else if (isLoggedIn && !hasCompletedOnboarding) {
      router.replace('/onboarding/welcome');
    }
  }, [isLoggedIn, hasCompletedOnboarding]);
  
  const handleSignUp = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/phone');
  };
  
  const handleLogin = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/phone');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Image with Gradient Overlay */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80' }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', colors.background, colors.background]}
        style={styles.gradient}
      />
      
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={[styles.logoText, { color: colors.text.primary }]}>
            HitMe
          </Text>
          <Text style={[styles.tagline, { color: colors.text.secondary }]}>
            Connect when it matters
          </Text>
        </View>
        
        <View style={styles.actionContainer}>
          <Text style={[styles.welcomeText, { color: colors.text.primary }]}>
            Welcome to HitMe
          </Text>
          <Text style={[styles.descriptionText, { color: colors.text.secondary }]}>
            The app that helps you connect with friends when they are available
          </Text>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.outlineButton, { borderColor: colors.border }]}
            onPress={handleLogin}
          >
            <Text style={[styles.outlineButtonText, { color: colors.text.primary }]}>
              Log In
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.termsText, { color: colors.text.light }]}>
            By signing up, you agree to our Terms of Service and Privacy Policy. We'll send you a verification code via SMS.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height: height * 0.6,
    top: 0,
  },
  gradient: {
    position: 'absolute',
    width,
    height: height * 0.6,
    top: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 42,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  actionContainer: {
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  outlineButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});