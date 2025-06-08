import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  countryCode: string;
  onCountryPress: () => void;
}

export const PhoneInput = ({ 
  value, 
  onChangeText, 
  countryCode, 
  onCountryPress 
}: PhoneInputProps) => {
  const { colors = darkTheme } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  
  // Format phone number as user types
  const handleChangeText = (text: string) => {
    // Remove any non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    onChangeText(cleaned);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.countryButton, 
          { 
            backgroundColor: colors.card,
            borderColor: isFocused ? colors.primary : colors.border,
          }
        ]}
        onPress={onCountryPress}
      >
        <Text style={[styles.countryCode, { color: colors.text.primary }]}>
          {countryCode}
        </Text>
        <ChevronDown size={16} color={colors.text.secondary} />
      </TouchableOpacity>
      
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: colors.card,
            borderColor: isFocused ? colors.primary : colors.border,
            color: colors.text.primary,
          }
        ]}
        value={value}
        onChangeText={handleChangeText}
        placeholder="Phone number"
        placeholderTextColor={colors.text.light}
        keyboardType="phone-pad"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={15}
        returnKeyType="done"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 100,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  input: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});