import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import { Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';

interface DurationSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (minutes: number) => void;
}

const DURATION_OPTIONS = [
  { label: '15m', sublabel: '15 minutes', value: 15 },
  { label: '30m', sublabel: '30 minutes', value: 30 },
  { label: '45m', sublabel: '45 minutes', value: 45 },
  { label: '1h', sublabel: '1 hour', value: 60 },
];

export const DurationSelector = ({ visible, onClose, onSelect }: DurationSelectorProps) => {
  const { colors } = useThemeStore();
  
  const handleSelect = (minutes: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect(minutes);
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>How long will you be available?</Text>
          </View>
          
          <View style={styles.optionsGrid}>
            {DURATION_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  index === 1 && styles.selectedOption // Default select 30m
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text style={[
                  styles.optionLabel,
                  { color: colors.text.primary },
                  index === 1 && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionSublabel,
                  { color: colors.text.secondary },
                  index === 1 && styles.selectedOptionText
                ]}>
                  {option.sublabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: colors.text.secondary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionButton: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedOption: {
    backgroundColor: '#4ADE80',
    borderColor: '#4ADE80',
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionSublabel: {
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});