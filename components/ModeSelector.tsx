import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Platform
} from 'react-native';
import { Briefcase, Home, Users, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Mode } from '@/types';

interface ModeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (mode: Mode | null) => void;
  currentMode: Mode | null;
}

interface ModeOption {
  id: Mode | null;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const ModeSelector = ({ 
  visible, 
  onClose, 
  onSelect,
  currentMode
}: ModeSelectorProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  const handleSelect = (mode: Mode | null) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect(mode);
  };
  
  const getModeOptions = (colors: any): ModeOption[] => [
    {
      id: null,
      label: 'All Contacts',
      icon: <X size={24} color={colors.text.primary} />,
      description: 'Show all contacts regardless of mode'
    },
    {
      id: 'work',
      label: 'Work Mode',
      icon: <Briefcase size={24} color={colors.primary} />,
      description: 'Only show work-related contacts'
    },
    {
      id: 'social',
      label: 'Social Mode',
      icon: <Users size={24} color={colors.primary} />,
      description: 'Only show social contacts'
    },
    {
      id: 'family',
      label: 'Family Mode',
      icon: <Home size={24} color={colors.primary} />,
      description: 'Only show family members'
    }
  ];
  
  const modeOptions = getModeOptions(colors);
  
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
            <Text style={[styles.title, { color: colors.text.primary }]}>Select Mode</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Choose which mode you want to go live with
          </Text>
          
          <View style={styles.optionsList}>
            {modeOptions.map((option) => (
              <TouchableOpacity
                key={option.id || 'all'}
                style={[
                  styles.optionButton,
                  { backgroundColor: colors.card },
                  currentMode === option.id && { borderColor: colors.primary, borderWidth: 2 }
                ]}
                onPress={() => handleSelect(option.id)}
              >
                <View style={styles.optionHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    {option.icon}
                  </View>
                  <Text style={[styles.optionLabel, { color: colors.text.primary }]}>
                    {option.label}
                  </Text>
                </View>
                <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  optionsList: {
    gap: 16,
  },
  optionButton: {
    borderRadius: 12,
    padding: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 14,
  },
});