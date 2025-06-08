import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  ViewStyle,
  Keyboard,
  Platform
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  containerStyle?: ViewStyle;
  codeLength?: number;
}

export const OTPInput = ({ 
  value, 
  onChange, 
  containerStyle,
  codeLength = 4
}: OTPInputProps) => {
  const { colors = darkTheme } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  
  // Create an array of refs for each input
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  // Initialize the refs array
  useEffect(() => {
    inputRefs.current = Array(codeLength).fill(null);
  }, [codeLength]);
  
  // Handle input change
  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;
    
    // Update the value
    onChange(newValue.join(''));
    
    // Move to next input if text is entered
    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle paste (for web)
  const handlePaste = (e: any) => {
    if (Platform.OS === 'web') {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text/plain').slice(0, codeLength);
      onChange(pastedData);
      
      // Focus the appropriate input
      if (pastedData.length === codeLength) {
        Keyboard.dismiss();
      } else if (pastedData.length < codeLength) {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {Array(codeLength).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: isFocused && index === value.length ? colors.primary : colors.border,
              color: colors.text.primary
            }
          ]}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          selectTextOnFocus
          caretHidden
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: 60,
    height: 60,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    borderWidth: 1,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});