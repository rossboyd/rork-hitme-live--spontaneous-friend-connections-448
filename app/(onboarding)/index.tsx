import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

// Onboarding screens data
const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to HitMe',
    description: 'The app that helps you connect with friends when it matters most',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '2',
    title: "Let Friends Know You are Available",
    description: "Go live when you have time to talk and let your friends know you are available",
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1490&q=80',
  },
  {
    id: '3',
    title: 'Connect Instantly',
    description: "When a friend goes live, you will get notified so you can connect right away",
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  const { completeOnboarding } = useAuthStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Complete onboarding
      completeOnboarding();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Navigate to main app
      router.replace('/(tabs)/home');
    } catch (err) {
      console.error('Error completing onboarding:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
    <View style={styles.slide}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { backgroundColor: colors.text.light },
                index === currentIndex && [styles.paginationDotActive, { backgroundColor: colors.primary }]
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
        
        {currentIndex < ONBOARDING_DATA.length - 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleComplete}
          >
            <Text style={[styles.skipText, { color: colors.text.secondary }]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingTop: 60,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  footer: {
    padding: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 20,
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
  skipButton: {
    alignItems: 'center',
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
});