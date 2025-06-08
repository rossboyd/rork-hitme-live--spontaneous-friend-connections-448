import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/common/Button';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Check, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const handleComplete = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <Check size={40} color="#000" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            You're All Set!
          </Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            Your app is now configured and ready to use. Start connecting with your friends in real-time.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleComplete}
          icon={<ArrowRight size={20} color="#000" />}
          style={styles.button}
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
  },
  button: {
    height: 56,
  },
});