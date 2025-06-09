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
  ScrollView,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';

const MOCK_OTP = '123456';
const OTP_LENGTH = 6;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_SIZE = Math.min(SCREEN_WIDTH * 0.12, 60);
const CELL_SPACING = 10;

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
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit) && newOtp.join('') === MOCK_OTP) {
      handleVerify();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === MOCK_OTP) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setUser({
        id: 'user-1',
        name: 'You',
        phone,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      });
      router.replace('/(tabs)/home');
    } else {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setError('Invalid code. Please try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCountdown(30);
    setIsResending(false);
    setError('');
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: darkTheme.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.content} onPress={Keyboard.dismiss}>
          <Text style={[styles.title, { color: darkTheme.text.primary }]}>
            Verify your number
          </Text>
          
          <Text style={[styles.subtitle, { color: darkTheme.text.secondary }]}>
            We sent a verification code to {phone}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
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
                  digit && styles.otpInputFilled
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                selectionColor={darkTheme.primary}
              />
            ))}
          </View>

          {error ? (
            <Text style={[styles.error, { color: darkTheme.accent }]}>{error}</Text>
          ) : (
            <Text style={[styles.hint, { color: darkTheme.text.light }]}>
              Enter the 6-digit code we sent you
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.resendButton,
              countdown > 0 && { opacity: 0.5 }
            ]}
            onPress={handleResend}
            disabled={countdown > 0 || isResending}
          >
            <Text style={[styles.resendText, { color: darkTheme.primary }]}>
              {isResending 
                ? 'Sending...' 
                : countdown > 0 
                  ? `Resend code in ${countdown}s`
                  : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </Pressable>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: CELL_SPACING,
    marginBottom: 24,
  },
  otpInput: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    borderWidth: 2,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: darkTheme.primary,
  },
  error: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  resendButton: {
    padding: 16,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '600',
  },
});