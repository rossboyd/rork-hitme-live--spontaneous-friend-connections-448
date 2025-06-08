import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/useAuthStore';

const OTP_LENGTH = 4;

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  const { login } = useAuthStore();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next input
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (countdown === 0) {
      setIsResending(true);
      // Simulate OTP resend
      setTimeout(() => {
        setIsResending(false);
        setCountdown(30);
      }, 1000);
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === OTP_LENGTH) {
      // For demo, any 4-digit code works
      login(phone);
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Enter verification code
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          We sent a 4-digit code to {phone}
        </Text>
        
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              style={[
                styles.otpInput,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text.primary
                }
              ]}
              value={digit}
              onChangeText={text => handleOtpChange(text.slice(-1), index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
        
        <Button
          title="Verify"
          onPress={handleVerify}
          disabled={otp.some(d => !d)}
          style={styles.verifyButton}
        />
        
        <TouchableOpacity
          onPress={handleResend}
          disabled={countdown > 0 || isResending}
          style={styles.resendContainer}
        >
          <Text style={[styles.resendText, { color: colors.text.light }]}>
            {countdown > 0 
              ? `Resend code in ${countdown}s`
              : isResending
              ? 'Sending...'
              : 'Resend code'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
  },
});