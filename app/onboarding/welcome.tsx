import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  
  const handleGetStarted = () => {
    router.replace('/onboarding/profile');
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
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Welcome to HitMe
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          The easiest way to let your friends know when you're available to chat
        </Text>
      </View>
      
      <View style={styles.featuresContainer}>
        {[
          { title: "Go Live", description: "Let friends know when you're free to talk" },
          { title: "Stay Connected", description: "Get notified when friends are available" },
          { title: "No Scheduling", description: "Spontaneous connections when it works for you" }
        ].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: colors.primary }]} />
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text.primary }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.text.secondary }]}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
        onPress={handleGetStarted}
      >
        <Text style={styles.getStartedButtonText}>Get Started</Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustration: {
    width: '100%',
    height: 240,
    borderRadius: 16,
  },
  textContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  getStartedButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});