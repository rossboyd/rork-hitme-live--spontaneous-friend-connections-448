import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/common/Button';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Image } from 'expo-image';
import { Users, ArrowRight } from 'lucide-react-native';
import * as Contacts from 'expo-contacts';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';

export default function ContactsPermissionScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  const { setHasCompletedOnboarding } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleRequestPermission = async () => {
    setLoading(true);
    
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status === 'granted') {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.push('/onboarding/notifications');
      } else {
        // Still allow proceeding even if denied
        router.push('/onboarding/notifications');
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      // Still allow proceeding on error
      router.push('/onboarding/notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/notifications');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
          <Users size={40} color={colors.primary} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Sync Your Contacts
          </Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            Allow HitMe to access your contacts to help you connect with friends who are already using the app.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Allow Contact Access"
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