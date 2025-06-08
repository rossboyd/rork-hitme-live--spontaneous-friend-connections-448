import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/common/Button';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Image } from 'expo-image';
import { ArrowRight } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Image
          source="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2940&auto=format&fit=crop"
          style={styles.image}
          contentFit="cover"
        />
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Welcome to HitMe
          </Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            Let's get your app set up so you can start connecting with friends in real-time.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/onboarding/contacts')}
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
  image: {
    width: 280,
    height: 280,
    borderRadius: 24,
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