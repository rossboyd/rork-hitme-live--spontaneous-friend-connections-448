import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/common/Button';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';

// Mock OTP for demo
const MOCK_OTP = '123456';

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const { setUser } = useAppStore();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = () => {
    if (otp === MOCK_OTP) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Create mock user
      setUser({
        id: 'user-1',
        name: 'You',
        phone: phone || '',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      });

      router.replace('/(tabs)/home');
    } else {
      setError('Invalid code. Please try again.');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError('');
    setOtp('');

    // Simulate OTP resend
    setTimeout(() => {
      setIsResending(false);
      setCountdown(30);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: darkTheme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: darkTheme.text.primary }]}>Verify your number</Text>
          <Text style={[styles.subtitle, { color: darkTheme.text.secondary }]}>
            Enter the code we sent to {phone}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={[
                styles.otpInput,
                { 
                  backgroundColor: darkTheme.card,
                  borderColor: error ? darkTheme.accent : darkTheme.border,
                  color: darkTheme.text.primary
                }
              ]}
              value={otp}
              onChangeText={(text) => {
                setOtp(text.replace(/[^\d]/g, ''));
                setError('');
              }}
              placeholder="Enter verification code"
              placeholderTextColor={darkTheme.text.light}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
            {error ? (
              <Text style={[styles.errorText, { color: darkTheme.accent }]}>{error}</Text>
            ) : (
              <Text style={[styles.helperText, { color: darkTheme.text.light }]}>
                Enter the 6-digit code
              </Text>
            )}
          </View>

          <Button
            title="Verify"
            onPress={handleVerify}
            disabled={otp.length !== 6}
            style={styles.button}
          />

          <Button
            title={countdown > 0 ? `Resend code (${countdown}s)` : 'Resend code'}
            variant="outline"
            onPress={handleResend}
            disabled={countdown > 0}
            loading={isResending}
            style={styles.resendButton}
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
  otpInput: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Medium',
    textAlign: 'center',
    letterSpacing: 8,
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
  resendButton: {
    height: 56,
  },
});