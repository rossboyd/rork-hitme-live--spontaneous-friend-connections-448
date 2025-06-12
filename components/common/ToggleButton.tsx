import React, { memo } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View,
  Animated,
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
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
        style
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.toggleContainer}>
        <View
          style={[
            styles.option,
            !isRightSelected && [styles.selectedOption, { backgroundColor: colors.primary }]
          ]}
        >
          <Text
            style={[
              styles.optionText,
              { color: !isRightSelected ? '#000' : colors.text.secondary }
            ]}
          >
            {leftLabel}
          </Text>
        </View>
        
        <View
          style={[
            styles.option,
            isRightSelected && [styles.selectedOption, { backgroundColor: colors.primary }]
          ]}
        >
          <Text
            style={[
              styles.optionText,
              { color: isRightSelected ? '#000' : colors.text.secondary }
            ]}
          >
            {rightLabel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

ToggleButton.displayName = 'ToggleButton';

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
  },
  option: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    // backgroundColor will be set dynamically
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});