// Reusable button component
import React, { memo } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button = memo(({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon
}: ButtonProps) => {
  const { colors = darkTheme } = useThemeStore();

  // Determine text color based on variant
  const getTextColor = () => {
    if (variant === 'outline') return colors.text.primary;
    if (variant === 'primary') return '#000'; // Black text on primary (green) buttons
    return '#fff'; // White text on other button types
  };

  const buttonStyles = [
    styles.button,
    styles[size],
    {
      backgroundColor: variant === 'primary' 
        ? colors.primary 
        : variant === 'secondary'
        ? colors.secondary
        : variant === 'danger'
        ? colors.accent
        : 'transparent',
      borderColor: variant === 'outline' ? colors.border : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
      opacity: disabled ? 0.6 : 1,
    },
    style
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    {
      color: getTextColor(),
    },
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  text: {
    fontWeight: '600',
    marginLeft: 8,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});