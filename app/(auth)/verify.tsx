import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { OTPInput } from '@/components/auth/OTPInput';
import { ChevronLeft } from 'lucide-react-native';

// Mock OTP for demo purposes
const MOCK_OTP = '1234';

export default function VerifyScreen() {
  const router = useRouter();
  const { verifyPhone, user } = useAuthStore();
  const { colors = darkTheme } = useThemeStore();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleVerify = async () => {
    if (otp.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter the 4-digit verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, we would verify the OTP with a backend service
      // For demo, we'll just check against our mock OTP
      setTimeout(() => {
        if (otp === MOCK_OTP) {
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          
          // Mark phone as verified
          verifyPhone();
          
          // Navigate to profile setup
          router.push('/profile');
        } else {
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          Alert.alert('Invalid Code', 'The verification code you entered is incorrect');
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error verifying code:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to verify code. Please try again.');
    }
  };
  
  const handleResendCode = () => {
    if (!canResend) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Reset countdown
    setCountdown(30);
    setCanResend(false);
    
    // In a real app, we would resend the OTP
    Alert.alert('Code Resent', 'A new verification code has been sent to your phone');
  };
  
  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Verification
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Enter verification code
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          We've sent a 4-digit code to {user?.phone || 'your phone'}
        </Text>
        
        <OTPInput
          value={otp}
          onChange={setOtp}
          containerStyle={styles.otpContainer}
          codeLength={4}
        />
        
        <TouchableOpacity
          style={[
            styles.button, 
            { backgroundColor: colors.primary },
            otp.length !== 4 && styles.buttonDisabled
          ]}
          onPress={handleVerify}
          disabled={isLoading || otp.length !== 4}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resendContainer}
          onPress={handleResendCode}
          disabled={!canResend}
        >
          <Text 
            style={[
              styles.resendText, 
              { color: canResend ? colors.primary : colors.text.light }
            ]}
          >
            {canResend 
              ? 'Resend Code' 
              : `Resend code in ${countdown}s`
            }
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.hintText, { color: colors.text.light }]}>
          For this demo, use code: {MOCK_OTP}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  otpContainer: {
    marginBottom: 32,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  resendContainer: {
    alignItems: 'center',
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  hintText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});