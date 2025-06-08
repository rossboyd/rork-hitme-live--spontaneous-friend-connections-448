import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { OTPInput } from '@/components/auth/OTPInput';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function VerifyScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  const { phoneNumber, verifyOTP, mockSendOTP, setVerificationId } = useAuthStore();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start countdown timer
  useEffect(() => {
    startCountdown();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startCountdown = () => {
    setCountdown(30);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleVerify = async () => {
    if (otp.length !== 4) {
      setError('Please enter a valid 4-digit code');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await verifyOTP(otp);
      
      if (success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Navigate to profile completion
        router.push('/(auth)/profile');
      } else {
        setError('Invalid verification code. Please try again.');
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Failed to verify code. Please try again.');
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    
    try {
      // Resend OTP
      const newVerificationId = await mockSendOTP();
      setVerificationId(newVerificationId);
      
      // Reset countdown
      startCountdown();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend code. Please try again.');
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsResending(false);
    }
  };
  
  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    
    // Simple formatting - in a real app you'd use a library like libphonenumber-js
    const lastFourDigits = phone.slice(-4);
    return `${phone.slice(0, -4)}****${lastFourDigits}`;
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Verify your number
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Enter the 4-digit code we sent to {formatPhoneNumber(phoneNumber)}
          </Text>
          
          <View style={styles.inputContainer}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              length={4}
              autoFocus
            />
            
            {error ? (
              <Text style={[styles.errorText, { color: colors.accent }]}>
                {error}
              </Text>
            ) : null}
          </View>
          
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              (otp.length !== 4 || isLoading) && styles.disabledButton
            ]}
            onPress={handleVerify}
            disabled={otp.length !== 4 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={countdown > 0 || isResending}
          >
            {isResending ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text
                style={[
                  styles.resendText,
                  { color: countdown > 0 ? colors.text.light : colors.primary }
                ]}
              >
                {countdown > 0
                  ? `Get your code again (${countdown}s)`
                  : 'Get your code again'}
              </Text>
            )}
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
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  inputContainer: {
    marginBottom: 32,
  },
  errorText: {
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  resendButton: {
    alignItems: 'center',
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
});