import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Phone } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { validatePhone } from '@/utils/validation';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAppStore();

  const handlePhoneSubmit = () => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Mock sending OTP
    router.push({
      pathname: '/verify',
      params: { phone }
    });
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters except +
    const cleaned = text.replace(/[^\d+]/g, '');
    setPhone(cleaned);
    setError('');
  };

  return (
    <View style={[styles.container, { backgroundColor: darkTheme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: darkTheme.text.primary }]}>Welcome to HitMe</Text>
          <Text style={[styles.subtitle, { color: darkTheme.text.secondary }]}>
            Enter your phone number to get started
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={[styles.phoneInput, { backgroundColor: darkTheme.card, borderColor: error ? darkTheme.accent : darkTheme.border }]}>
              <Phone size={20} color={darkTheme.text.light} style={styles.icon} />
              <TextInput
                style={[styles.input, { color: darkTheme.text.primary }]}
                value={phone}
                onChangeText={formatPhoneNumber}
                placeholder="Enter phone number"
                placeholderTextColor={darkTheme.text.light}
                keyboardType="phone-pad"
                autoFocus
                autoComplete="tel"
              />
            </View>
            {error ? (
              <Text style={[styles.errorText, { color: darkTheme.accent }]}>{error}</Text>
            ) : (
              <Text style={[styles.helperText, { color: darkTheme.text.light }]}>
                Include country code (e.g. +1)
              </Text>
            )}
          </View>

          <Button
            title="Continue"
            onPress={handlePhoneSubmit}
            disabled={!phone.length}
            style={styles.button}
          />
        </View>
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
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  errorText: {
    fontSize: 14,
    marginLeft: 16,
  },
  helperText: {
    fontSize: 14,
    marginLeft: 16,
  },
  button: {
    height: 56,
  },
});