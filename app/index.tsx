import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ChevronDown } from 'lucide-react-native';
import { validatePhone } from '@/utils/validation';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('+1');
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

    // Mock sending OTP
    router.push({
      pathname: '/verify',
      params: { phone: fullPhone }
    });
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/[^\d]/g, '');
    setPhoneNumber(cleaned);
    setError('');
  };

  const formatCountryCode = (text: string) => {
    // Ensure it starts with + and only contains digits
    let cleaned = text.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.replace(/\+/g, '');
    }
    setCountryCode(cleaned);
    setError('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: darkTheme.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: darkTheme.text.primary }]}>Log in / Sign up</Text>
          <Text style={[styles.subtitle, { color: darkTheme.text.secondary }]}>
            You'll be able to connect with friends, get notifications when they're available, and do other nice things
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.phoneInputRow}>
            <TouchableOpacity style={[styles.countryCodeInput, { backgroundColor: darkTheme.card, borderColor: darkTheme.border }]}>
              <Text style={[styles.flagEmoji]}>🇺🇸</Text>
              <TextInput
                style={[styles.countryCodeText, { color: darkTheme.text.primary }]}
                value={countryCode}
                onChangeText={formatCountryCode}
                placeholder="+1"
                placeholderTextColor={darkTheme.text.light}
                keyboardType="phone-pad"
                maxLength={4}
              />
              <ChevronDown size={16} color={darkTheme.text.light} />
            </TouchableOpacity>
            
            <TextInput
              style={[
                styles.phoneNumberInput, 
                { 
                  backgroundColor: darkTheme.card, 
                  borderColor: error ? darkTheme.accent : darkTheme.border,
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
            <Text style={[styles.errorText, { color: darkTheme.accent }]}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.nextButton,
              { 
                backgroundColor: phoneNumber.length > 0 ? darkTheme.text.light : darkTheme.border,
                opacity: phoneNumber.length > 0 ? 1 : 0.6
              }
            ]}
            onPress={handlePhoneSubmit}
            disabled={!phoneNumber.length}
          >
            <Text style={[styles.nextButtonText, { color: darkTheme.background }]}>NEXT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.termsText, { color: darkTheme.text.light }]}>
            By signing up you accept our{' '}
            <Text style={[styles.linkText, { color: darkTheme.primary }]}>terms of use</Text>
            {' '}and{' '}
            <Text style={[styles.linkText, { color: darkTheme.primary }]}>privacy policy</Text>
            . We'll text you a code to verify your account (usual rates may apply). We'll also text you if you opt into text updates about events (frequency varies). To opt out of texts, reply STOP to any of them. For help, go to hitme.app/help/account.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  form: {
    marginBottom: 40,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  countryCodeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
    minWidth: 120,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
  },
  phoneNumberInput: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  nextButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});