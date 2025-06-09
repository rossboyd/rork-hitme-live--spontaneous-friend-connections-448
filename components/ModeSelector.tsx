import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Briefcase, Home, Users, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Mode } from '@/types';

interface ModeSelectorProps {
  selectedModes: (Mode | null)[];
  onToggleMode: (mode: Mode | null) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

interface ModeOption {
  id: Mode | null;
  label: string;
  icon: React.ReactNode;
}

export const ModeSelector = ({ 
  selectedModes,
  onToggleMode,
  onSelectAll,
  onClearAll
}: ModeSelectorProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  const handleToggle = (mode: Mode | null) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onToggleMode(mode);
  };
  
  const getModeOptions = (colors: any): ModeOption[] => [
    {
      id: 'work',
      label: 'Work',
      icon: <Briefcase size={16} color={colors.text.primary} />
    },
    {
      id: 'social',
      label: 'Social',
      icon: <Users size={16} color={colors.text.primary} />
    },
    {
      id: 'family',
      label: 'Family',
      icon: <Home size={16} color={colors.text.primary} />
    },
    {
      id: null,
      label: 'All',
      icon: <X size={16} color={colors.text.primary} />
    }
  ];
  
  const modeOptions = getModeOptions(colors);
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Select Modes
      </Text>
      
      <View style={styles.pillsContainer}>
        {modeOptions.map((option) => (
          <TouchableOpacity
            key={option.id || 'all'}
            style={[
              styles.pill,
              { 
                backgroundColor: selectedModes.includes(option.id) 
                  ? colors.primary 
                  : colors.card 
              }
            ]}
            onPress={() => handleToggle(option.id)}
          >
            <View style={styles.pillContent}>
              {option.icon}
              <Text 
                style={[
                  styles.pillText, 
                  { 
                    color: selectedModes.includes(option.id) 
                      ? '#FFFFFF' 
                      : colors.text.primary 
                  }
                ]}
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onSelectAll}
        >
          <Text style={[styles.actionText, { color: colors.primary }]}>
            Select All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onClearAll}
        >
          <Text style={[styles.actionText, { color: colors.text.secondary }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});