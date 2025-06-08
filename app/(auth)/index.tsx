import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing
} from 'react-native-reanimated';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  
  // Animation values
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  
  // Set up animations
  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, { duration: 1000 });
    logoScale.value = withTiming(1, { duration: 1200, easing: Easing.elastic(1.2) });
    
    // Text animation
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    
    // Button animation
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
    
    // Pulse animation for logo (only on native platforms)
    if (Platform.OS !== 'web') {
      logoScale.value = withDelay(
        1500, 
        withRepeat(
          withTiming(1.05, { duration: 2000, easing: Easing.ease }),
          -1,
          true
        )
      );
    }
  }, []);
  
  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: (1 - textOpacity.value) * 20 }],
  }));
  
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: (1 - buttonOpacity.value) * 20 }],
  }));
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(0, 255, 0, 0.1)', 'rgba(0, 0, 0, 0)']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
      />
      
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop' }}
            style={styles.logoBackground}
            contentFit="cover"
          />
          <View style={styles.logoOverlay} />
          <Text style={styles.logoText}>HitMe</Text>
        </Animated.View>
        
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Connect when it matters
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Let your friends know when you're available to talk and connect instantly
          </Text>
        </Animated.View>
        
        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/phone')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.textButton}
            onPress={() => router.push('/(auth)/phone')}
          >
            <Text style={[styles.textButtonText, { color: colors.text.secondary }]}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: height * 0.12,
    paddingBottom: 40,
  },
  logoContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  buttonContainer: {
    width: '100%',
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
  textButton: {
    alignItems: 'center',
    padding: 8,
  },
  textButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
});