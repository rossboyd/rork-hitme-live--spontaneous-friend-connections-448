import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  ViewStyle
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { ChevronDown } from 'lucide-react-native';
import { CountryPicker } from './CountryPicker';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: ViewStyle;
}

export const PhoneInput = ({ 
  value, 
  onChangeText, 
  containerStyle 
}: PhoneInputProps) => {
  const { colors = darkTheme } = useThemeStore();
  const [countryCode, setCountryCode] = useState('+1');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  
  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    setIsPickerVisible(false);
  };
  
  const handlePhoneChange = (text: string) => {
    // Remove any non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    onChangeText(cleaned);
  };
  
  // Format the phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    
    // Format US numbers like (XXX) XXX-XXXX
    if (countryCode === '+1' && phone.length > 0) {
      let formatted = '';
      
      if (phone.length > 0) {
        formatted += phone.substring(0, Math.min(3, phone.length));
      }
      
      if (phone.length > 3) {
        formatted = `(${formatted}) ${phone.substring(3, Math.min(6, phone.length))}`;
      }
      
      if (phone.length > 6) {
        formatted += `-${phone.substring(6, Math.min(10, phone.length))}`;
      }
      
      return formatted;
    }
    
    // For other countries, just return the number
    return phone;
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity 
        style={[styles.countryButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setIsPickerVisible(true)}
      >
        <Text style={[styles.countryCode, { color: colors.text.primary }]}>
          {countryCode}
        </Text>
        <ChevronDown size={16} color={colors.text.light} />
      </TouchableOpacity>
      
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: colors.card, 
            color: colors.text.primary,
            borderColor: colors.border
          }
        ]}
        placeholder="Phone number"
        placeholderTextColor={colors.text.light}
        keyboardType="phone-pad"
        value={formatPhoneNumber(value)}
        onChangeText={handlePhoneChange}
      />
      
      <CountryPicker
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelect={handleCountrySelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 4,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});