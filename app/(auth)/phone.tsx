import React, { useState } from 'react';
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
import { PhoneInput } from '@/components/auth/PhoneInput';
import { ChevronLeft } from 'lucide-react-native';

export default function PhoneScreen() {
  const router = useRouter();
  const { setPhoneNumber } = useAuthStore();
  const { colors = darkTheme } = useThemeStore();
  
  const [phoneNumber, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      // Save phone number to auth store
      setPhoneNumber(phoneNumber);
      
      // In a real app, we would send an OTP to this number
      // For now, we'll just simulate it
      setTimeout(() => {
        setIsLoading(false);
        router.push('/verify');
      }, 1000);
    } catch (error) {
      console.error('Error sending verification code:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    }
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
          Your Phone
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Enter your phone number
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          We'll send you a verification code to confirm your identity
        </Text>
        
        <PhoneInput
          value={phoneNumber}
          onChangeText={setPhone}
          containerStyle={styles.inputContainer}
        />
        
        <TouchableOpacity
          style={[
            styles.button, 
            { backgroundColor: colors.primary },
            (!phoneNumber || phoneNumber.length < 10) && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={isLoading || !phoneNumber || phoneNumber.length < 10}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending Code...' : 'Continue'}
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.termsText, { color: colors.text.light }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy. Message and data rates may apply.
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
  inputContainer: {
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
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});