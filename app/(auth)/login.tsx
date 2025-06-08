import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { ChevronDown } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { validatePhone } from '@/utils/validation';
import { CountryCodePicker } from '@/components/auth/CountryCodePicker';

export default function LoginScreen() {
  const router = useRouter();
  const { colors = darkTheme } = useThemeStore();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+44');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  
  const handleNext = () => {
    const fullPhone = `${countryCode}${phone}`;
    if (validatePhone(fullPhone)) {
      router.push({
        pathname: '/verify',
        params: { phone: fullPhone }
      });
    }
  };

  const handleTermsPress = () => {
    Linking.openURL('https://hitme.app/terms');
  };

  const handlePrivacyPress = () => {
    Linking.openURL('https://hitme.app/privacy');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Log in / Sign up
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Connect with friends, manage your availability, and get notified when people want to talk.
          </Text>
          
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[styles.countryCode, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={[styles.countryCodeText, { color: colors.text.primary }]}>
                {countryCode}
              </Text>
              <ChevronDown size={20} color={colors.text.light} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.phoneInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text.primary }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor={colors.text.light}
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
            />
          </View>
          
          <Button
            title="Next"
            onPress={handleNext}
            disabled={!phone.trim() || !validatePhone(`${countryCode}${phone}`)}
            style={styles.nextButton}
          />
          
          <Text style={[styles.terms, { color: colors.text.light }]}>
            By signing up you accept our{' '}
            <Text style={styles.link} onPress={handleTermsPress}>
              terms of use
            </Text>
            {' '}and{' '}
            <Text style={styles.link} onPress={handlePrivacyPress}>
              privacy policy
            </Text>
            . We'll text you a code to verify your account (carrier rates may apply).
          </Text>
        </View>
      </ScrollView>

      <CountryCodePicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={(code) => {
          setCountryCode(code);
          setShowCountryPicker(false);
        }}
        selectedCode={countryCode}
      />
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
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  nextButton: {
    marginBottom: 24,
  },
  terms: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
});