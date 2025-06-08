import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Keyboard,
  Platform
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export const OTPInput = ({ 
  length = 4, 
  value, 
  onChange, 
  autoFocus = true 
}: OTPInputProps) => {
  const { colors = darkTheme } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  
  // Create refs for each input
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  // Initialize refs array
  useEffect(() => {
    inputRefs.current = Array(length).fill(null);
  }, [length]);
  
  // Auto focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 500);
    }
  }, [autoFocus]);
  
  // Handle input change
  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    
    // Only accept digits
    if (/^\d*$/.test(text)) {
      newValue[index] = text;
      onChange(newValue.join(''));
      
      // Auto advance to next input if a digit was entered
      if (text.length === 1 && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !value[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle paste (for web)
  const handlePaste = (e: any) => {
    if (Platform.OS === 'web') {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text/plain').trim();
      
      if (/^\d+$/.test(pastedData)) {
        const digits = pastedData.slice(0, length).split('');
        onChange(digits.join(''));
        
        // Focus the next empty input or the last one
        const nextEmptyIndex = digits.length < length ? digits.length : length - 1;
        inputRefs.current[nextEmptyIndex]?.focus();
      }
    }
  };
  
  return (
    <View style={styles.container}>
      {Array(length).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => inputRefs.current[index] = ref}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: isFocused && inputRefs.current[index]?.isFocused?.() 
                ? colors.primary 
                : colors.border,
              color: colors.text.primary,
            }
          ]}
          value={value[index] || ''}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          textContentType="oneTimeCode"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});