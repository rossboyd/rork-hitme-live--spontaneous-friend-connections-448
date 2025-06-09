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
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Bell, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

export default function NotificationsPermissionScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useAppStore();
  const { colors = darkTheme } = useThemeStore();
  
  const handleAllowNotifications = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // In a real app, this would request notification permissions
    // Mark onboarding as completed
    setHasCompletedOnboarding(true);
    
    // Navigate to the main app
    router.replace('/(tabs)/home');
  };
  
  const handleSkip = () => {
    // Mark onboarding as completed even if user skips notifications
    setHasCompletedOnboarding(true);
    
    // Navigate to the main app
    router.replace('/(tabs)/home');
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Stay in the loop
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Get notified when your friends are available to chat
        </Text>
      </View>
      
      <View style={styles.illustrationContainer}>
        <View style={[styles.notificationCard, { backgroundColor: colors.card }]}>
          <View style={[styles.notificationIcon, { backgroundColor: colors.primary }]}>
            <Bell size={24} color="#000" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={[styles.notificationTitle, { color: colors.text.primary }]}>
              Sarah is available now
            </Text>
            <Text style={[styles.notificationBody, { color: colors.text.secondary }]}>
              Tap to connect with her
            </Text>
          </View>
        </View>
        
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
          style={styles.avatarImage}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.allowButton, { backgroundColor: colors.primary }]}
          onPress={handleAllowNotifications}
        >
          <Text style={styles.allowButtonText}>Allow Notifications</Text>
          <ChevronRight size={20} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.skipButton, { borderColor: colors.border }]}
          onPress={handleSkip}
        >
          <Text style={[styles.skipButtonText, { color: colors.text.secondary }]}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.privacyText, { color: colors.text.light }]}>
        You can change notification settings at any time in your profile
      </Text>
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
  header: {
    marginBottom: 40,
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
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  notificationBody: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  avatarImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 16,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  allowButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  allowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  skipButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  privacyText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
  },
});