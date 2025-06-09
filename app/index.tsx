import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ChevronDown } from 'lucide-react-native';
import { validatePhone } from '@/utils/validation';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAppStore();

  const handlePhoneSubmit = () => {
    const fullPhone = countryCode + phoneNumber;
    
    if (!validatePhone(fullPhone)) {
      setError('Please enter a valid phone number');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    router.push({
      pathname: '/verify',
      params: { phone: fullPhone }
    });
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/[^\d]/g, '');
    setPhoneNumber(cleaned);
    setError('');
  };

  const formatCountryCode = (text: string) => {
    let cleaned = text.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.replace(/\+/g, '');
    }
    setCountryCode(cleaned);
    setError('');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: darkTheme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: darkTheme.text.primary }]}>
                Log in / Sign up
              </Text>
              <Text style={[styles.subtitle, { color: darkTheme.text.secondary }]}>
                You'll be able to connect with friends, get notifications when they're available, and do other nice things
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputRow}>
                <TouchableOpacity 
                  style={[styles.countrySelect, { backgroundColor: darkTheme.card }]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flagEmoji}>🇬🇧</Text>
                  <TextInput
                    style={[styles.countryInput, { color: darkTheme.text.primary }]}
                    value={countryCode}
                    onChangeText={formatCountryCode}
                    placeholder="+44"
                    placeholderTextColor={darkTheme.text.light}
                    keyboardType="phone-pad"
                    maxLength={4}
                  />
                  <ChevronDown size={16} color={darkTheme.text.light} />
                </TouchableOpacity>
                
                <TextInput
                  style={[
                    styles.phoneInput,
                    { 
                      backgroundColor: darkTheme.card,
                      borderColor: error ? darkTheme.accent : 'transparent',
                      color: darkTheme.text.primary 
                    }
                  ]}
                  value={phoneNumber}
                  onChangeText={formatPhoneNumber}
                  placeholder="Phone number"
                  placeholderTextColor={darkTheme.text.light}
                  keyboardType="phone-pad"
                  autoFocus
                />
              </View>
              
              {error ? (
                <Text style={[styles.errorText, { color: darkTheme.accent }]}>
                  {error}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.nextButton,
                  { 
                    backgroundColor: phoneNumber.length > 0 ? darkTheme.primary : darkTheme.border,
                    opacity: phoneNumber.length > 0 ? 1 : 0.6
                  }
                ]}
                onPress={handlePhoneSubmit}
                disabled={!phoneNumber.length}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.termsText, { color: darkTheme.text.light }]}>
                By signing up you accept our{' '}
                <Text style={[styles.linkText, { color: darkTheme.primary }]}>
                  terms of use
                </Text>
                {' '}and{' '}
                <Text style={[styles.linkText, { color: darkTheme.primary }]}>
                  privacy policy
                </Text>
                . We'll text you a code to verify your account (usual rates may apply).
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
    paddingBottom: 20,
    width: '100%',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  form: {
    width: '100%',
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    width: '100%',
  },
  countrySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    minWidth: 110,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  countryInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 4,
  },
  nextButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'left',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});