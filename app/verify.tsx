import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Button } from '@/components/common/Button';

const OTP_LENGTH = 6;

export default function VerifyScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<TextInput[]>([]);
  const [timer, setTimer] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !isResendActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendActive(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async (e: any) => {
    try {
      let text;
      if (Platform.OS === 'web') {
        text = e.clipboardData.getData('text');
      } else {
        text = e.nativeEvent.text;
      }
      
      if (text) {
        const digits = text.replace(/\D/g, '').split('').slice(0, OTP_LENGTH);
        setOtp(digits);
        
        // Focus last input or first empty input
        const lastIndex = digits.length - 1;
        if (lastIndex >= 0 && lastIndex < OTP_LENGTH) {
          inputRefs.current[lastIndex]?.focus();
        }
      }
    } catch (error) {
      console.error('Error handling paste:', error);
    }
  };

  const handleResend = () => {
    if (isResendActive) {
      setTimer(30);
      setIsResendActive(false);
      // Implement resend logic here
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === OTP_LENGTH) {
      // Implement verification logic here
      router.push('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Verify your number
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Enter the 6-digit code we sent to your phone
          </Text>

          <View style={styles.otpContainer}>
            {Array(OTP_LENGTH).fill(0).map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => ref && (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text.primary
                  }
                ]}
                value={otp[index]}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onPaste={handlePaste}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                selectionColor={colors.primary}
              />
            ))}
          </View>

          <Button
            title="Verify"
            onPress={handleVerify}
            disabled={otp.join('').length !== OTP_LENGTH}
            style={styles.verifyButton}
          />

          <TouchableOpacity
            onPress={handleResend}
            disabled={!isResendActive}
            style={styles.resendContainer}
          >
            <Text
              style={[
                styles.resendText,
                { 
                  color: isResendActive ? colors.primary : colors.text.light 
                }
              ]}
            >
              {isResendActive
                ? "Resend code"
                : `Resend code in ${timer}s`}
            </Text>
          </TouchableOpacity>
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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: 8,
    marginBottom: 32,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  verifyButton: {
    width: '100%',
    marginBottom: 16,
  },
  resendContainer: {
    padding: 8,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '500',
  },
});