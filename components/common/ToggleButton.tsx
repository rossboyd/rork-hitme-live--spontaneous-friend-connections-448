import React, { memo } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View,
  StyleProp,
  ViewStyle
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface ToggleButtonProps {
  leftLabel: string;
  rightLabel: string;
  isRightSelected: boolean;
  onToggle: (isRightSelected: boolean) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const ToggleButton = memo(({
  leftLabel,
  rightLabel,
  isRightSelected,
  onToggle,
  style,
  disabled = false
}: ToggleButtonProps) => {
  const { colors = darkTheme } = useThemeStore();

  const handlePress = () => {
    if (!disabled) {
      onToggle(!isRightSelected);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
        style
      ]}
    >
      <TouchableOpacity
        style={[
          styles.option,
          !isRightSelected && [styles.selectedOption, { backgroundColor: colors.primary }]
        ]}
        onPress={() => !disabled && onToggle(false)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.optionText,
            { color: !isRightSelected ? '#000' : colors.text.secondary }
          ]}
        >
          {leftLabel}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          isRightSelected && [styles.selectedOption, { backgroundColor: colors.primary }]
        ]}
        onPress={() => !disabled && onToggle(true)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.optionText,
            { color: isRightSelected ? '#000' : colors.text.secondary }
          ]}
        >
          {rightLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

ToggleButton.displayName = 'ToggleButton';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  selectedOption: {
    // backgroundColor will be set dynamically
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});