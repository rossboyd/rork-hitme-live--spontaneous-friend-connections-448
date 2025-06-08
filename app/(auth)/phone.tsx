import React, { useState } from 'react';
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
import { PhoneInput } from '@/components/auth/PhoneInput';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { darkTheme } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function PhoneScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  const { setPhoneNumber, setVerificationId, mockSendOTP } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleContinue = async () => {
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Store the full phone number with country code
      const fullPhoneNumber = `${countryCode}${phone}`;
      setPhoneNumber(fullPhoneNumber);
      
      // Mock sending OTP
      const verificationId = await mockSendOTP();
      setVerificationId(verificationId);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Navigate to verification screen
      router.push('/(auth)/verify');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send verification code. Please try again.');
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCountryPress = () => {
    // In a real app, this would open a country picker
    // For this demo, we'll just toggle between a few codes
    if (countryCode === '+1') {
      setCountryCode('+44');
    } else if (countryCode === '+44') {
      setCountryCode('+61');
    } else {
      setCountryCode('+1');
    }
  };
  
  const isButtonDisabled = phone.length < 10 || isLoading;
  
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
            Enter your phone number
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            We'll text you a code to verify your account
          </Text>
          
          <View style={styles.inputContainer}>
            <PhoneInput
              value={phone}
              onChangeText={setPhone}
              countryCode={countryCode}
              onCountryPress={handleCountryPress}
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
              isButtonDisabled && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={isButtonDisabled}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
          
          <Text style={[styles.termsText, { color: colors.text.light }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy. We'll text you a code to verify your account (standard rates may apply).
          </Text>
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
    marginTop: 8,
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
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});