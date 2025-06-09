import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Platform,
  Keyboard,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';

const MOCK_OTP = '123456';
const OTP_LENGTH = 6;

export default function VerifyScreen() {
  const params = useLocalSearchParams();
  const phone = params.phone as string;
  const router = useRouter();
  const { setUser } = useAppStore();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleInputChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const pastedText = text.slice(0, OTP_LENGTH);
      const newOtp = [...otp];
      for (let i = 0; i < pastedText.length; i++) {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = pastedText[i];
        }
      }
      setOtp(newOtp);
      setError('');
      
      // Focus last input or submit if complete
      if (pastedText.length + index >= OTP_LENGTH) {
        Keyboard.dismiss();
        handleVerify(newOtp.join(''));
      } else {
        focusInput(index + pastedText.length);
      }
    } else {
      // Handle single digit
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      setError('');

      if (text !== '') {
        if (index < OTP_LENGTH - 1) {
          focusInput(index + 1);
        } else {
          Keyboard.dismiss();
          handleVerify(newOtp.join(''));
        }
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        focusInput(index - 1);
      }
    }
  };

  const handleVerify = (code: string = otp.join('')) => {
    if (code === MOCK_OTP) {
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
      setOtp(Array(OTP_LENGTH).fill(''));
      focusInput(0);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError('');
    setOtp(Array(OTP_LENGTH).fill(''));
    focusInput(0);

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
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: darkTheme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: darkTheme.text.primary }]}>
              Verify your number
            </Text>
            <Text style={[styles.subtitle, { color: darkTheme.text.secondary }]}>
              Enter the code we sent to {phone}
            </Text>
          </View>

          <Pressable onPress={() => focusInput(0)}>
            <View style={styles.otpContainer}>
              {Array(OTP_LENGTH).fill(0).map((_, index) => (
                <TextInput
                  key={index}
                  ref={ref => inputRefs.current[index] = ref}
                  style={[
                    styles.otpInput,
                    { 
                      backgroundColor: darkTheme.card,
                      borderColor: error ? darkTheme.accent : darkTheme.border,
                      color: darkTheme.text.primary 
                    },
                    otp[index] && styles.otpInputFilled
                  ]}
                  value={otp[index]}
                  onChangeText={(text) => handleInputChange(text.replace(/[^\d]/g, ''), index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={index === 0 ? OTP_LENGTH : 1}
                  selectTextOnFocus
                  selectionColor={darkTheme.primary}
                />
              ))}
            </View>
          </Pressable>

          {error ? (
            <Text style={[styles.errorText, { color: darkTheme.accent }]}>{error}</Text>
          ) : (
            <Text style={[styles.helperText, { color: darkTheme.text.light }]}>
              Enter the 6-digit code
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                { 
                  backgroundColor: otp.every(digit => digit) ? darkTheme.primary : darkTheme.border,
                  opacity: otp.every(digit => digit) ? 1 : 0.6
                }
              ]}
              onPress={() => handleVerify()}
              disabled={!otp.every(digit => digit)}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.resendButton,
                { 
                  borderColor: countdown > 0 ? darkTheme.border : darkTheme.primary,
                  opacity: countdown > 0 || isResending ? 0.6 : 1
                }
              ]}
              onPress={handleResend}
              disabled={countdown > 0 || isResending}
            >
              <Text 
                style={[
                  styles.resendButtonText,
                  { color: countdown > 0 ? darkTheme.text.light : darkTheme.primary }
                ]}
              >
                {countdown > 0 ? `Resend code (${countdown}s)` : 'Resend code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Medium',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: darkTheme.primary,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  helperText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  verifyButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  resendButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});