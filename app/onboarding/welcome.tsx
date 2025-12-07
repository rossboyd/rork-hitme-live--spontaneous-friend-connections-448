import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Platform
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  
  const handleGetStarted = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    router.push('/onboarding/profile' as Href);
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.logoContainer}>
        <Text style={[styles.logo, { color: colors.primary }]}>HitMeApp</Text>
      </View>
      
      <View style={styles.illustrationContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
          style={styles.illustration}
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Connect when it matters
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          Let your friends know when you&apos;re available to chat, and get notified when they are too.
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
        onPress={handleGetStarted}
      >
        <Text style={styles.getStartedText}>Get Started</Text>
        <ChevronRight size={20} color="#000" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  illustration: {
    width: '100%',
    height: 300,
    borderRadius: 20,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  getStartedButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});