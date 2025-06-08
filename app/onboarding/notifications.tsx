import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/common/Button';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Bell, ArrowRight } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';

export default function NotificationsPermissionScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  const { setHasCompletedOnboarding } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleRequestPermission = async () => {
    setLoading(true);
    
    try {
      if (Platform.OS !== 'web') {
        const { status } = await Notifications.requestPermissionsAsync();
        
        if (status === 'granted') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
      
      // Proceed to completion regardless of permission status
      setHasCompletedOnboarding(true);
      router.push('/onboarding/complete');
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      // Still proceed on error
      setHasCompletedOnboarding(true);
      router.push('/onboarding/complete');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    router.push('/onboarding/complete');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
          <Bell size={40} color={colors.primary} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Stay Notified
          </Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            Get notified when your friends are available to chat. Never miss a connection opportunity.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Enable Notifications"
          onPress={handleRequestPermission}
          loading={loading}
          icon={<ArrowRight size={20} color="#000" />}
          style={styles.button}
        />
        
        <Button
          title="Skip for Now"
          variant="outline"
          onPress={handleSkip}
          style={styles.skipButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
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
    maxWidth: 300,
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
    gap: 12,
  },
  button: {
    height: 56,
  },
  skipButton: {
    height: 56,
  },
});