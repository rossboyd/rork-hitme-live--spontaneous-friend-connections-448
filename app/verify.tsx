import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setUser, hasCompletedOnboarding } = useAppStore();
  const { colors = darkTheme } = useThemeStore();
  
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);
  
  // Get phone number from params or use a default
  const phoneNumber = params.phone as string || '+44987654321';
  
  useEffect(() => {
    // Start countdown for resend button
    if (countdown > 0 && !isResendActive) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isResendActive) {
      setIsResendActive(true);
    }
  }, [countdown, isResendActive]);
  
  const handleVerify = () => {
    if (otp.length < 4) {
      Alert.alert('Invalid Code', 'Please enter a valid verification code');
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Set initial user data with the phone number
    setUser({
      id: 'user-1',
      name: 'You',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      phone: phoneNumber,
    });
    
    // If user has already completed onboarding, go to home
    // Otherwise, go to profile setup
    if (hasCompletedOnboarding) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/onboarding/profile');
    }
  };
  
  const handleResendCode = () => {
    if (!isResendActive) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Reset countdown
    setCountdown(30);
    setIsResendActive(false);
    
    // Show confirmation
    Alert.alert('Code Resent', 'A new verification code has been sent to your phone');
  };
  
  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Verify your number
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Enter the 4-digit code sent to {phoneNumber}
        </Text>
        
        <View style={styles.otpContainer}>
          <TextInput
            style={[styles.otpInput, { backgroundColor: colors.card, color: colors.text.primary }]}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="0000"
            placeholderTextColor={colors.text.light}
            autoFocus
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.verifyButton, 
            { 
              backgroundColor: otp.length === 4 ? colors.primary : colors.border,
              opacity: otp.length === 4 ? 1 : 0.6
            }
          ]}
          onPress={handleVerify}
          disabled={otp.length !== 4}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendCode}
          disabled={!isResendActive}
        >
          <Text style={[
            styles.resendText, 
            { 
              color: isResendActive ? colors.primary : colors.text.light 
            }
          ]}>
            {isResendActive 
              ? 'Resend Code' 
              : `Resend code in ${countdown}s`
            }
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  otpInput: {
    width: 200,
    height: 60,
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  verifyButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  resendButton: {
    padding: 12,
  },
  resendText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
  },
});