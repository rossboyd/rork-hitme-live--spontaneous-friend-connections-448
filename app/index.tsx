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
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { ChevronDown } from 'lucide-react-native';
import { validatePhone } from '@/utils/validation';
import * as Haptics from 'expo-haptics';
import { darkTheme } from '@/constants/colors';
import { mockContacts } from '@/mocks/contacts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
];

export default function LoginScreen() {
  const router = useRouter();
  const { addContact } = useAppStore();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    const fullPhone = selectedCountry.code + phoneNumber;
    
    if (!validatePhone(fullPhone)) {
      setError('Please enter a valid phone number');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    setIsLoading(true);
    setError('');

    // Add mock contacts when user logs in
    mockContacts.forEach(contact => {
      addContact(contact);
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsLoading(false);
    router.push({
      pathname: '/verify',
      params: { phone: fullPhone }
    });
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
          <View style={[styles.container, { width: SCREEN_WIDTH }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: darkTheme.text.primary }]}>
                Welcome to HitMe
              </Text>
              <Text style={[styles.subtitle, { color: darkTheme.text.secondary }]}>
                Connect with friends when you're both free
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={[styles.label, { color: darkTheme.text.primary }]}>
                Phone Number
              </Text>
              
              <View style={[styles.phoneContainer, { backgroundColor: darkTheme.card, borderColor: darkTheme.border }]}>
                <TouchableOpacity style={styles.countrySelector}>
                  <Text style={[styles.flag, { color: darkTheme.text.primary }]}>
                    {selectedCountry.flag}
                  </Text>
                  <Text style={[styles.countryCode, { color: darkTheme.text.primary }]}>
                    {selectedCountry.code}
                  </Text>
                  <ChevronDown size={16} color={darkTheme.text.light} />
                </TouchableOpacity>
                
                <TextInput
                  style={[styles.phoneInput, { color: darkTheme.text.primary }]}
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setError('');
                  }}
                  placeholder="Enter your phone number"
                  placeholderTextColor={darkTheme.text.light}
                  keyboardType="phone-pad"
                  autoFocus
                />
              </View>

              {error ? (
                <Text style={[styles.error, { color: darkTheme.accent }]}>{error}</Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  { backgroundColor: darkTheme.primary },
                  (!phoneNumber || isLoading) && { opacity: 0.6 }
                ]}
                onPress={handleContinue}
                disabled={!phoneNumber || isLoading}
              >
                <Text style={[styles.continueText, { color: "#000" }]}>
                  {isLoading ? 'Sending...' : 'Continue'}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.disclaimer, { color: darkTheme.text.light }]}>
                By continuing, you agree to our Terms of Service and Privacy Policy
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  phoneContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    marginTop: 8,
  },
  continueButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});