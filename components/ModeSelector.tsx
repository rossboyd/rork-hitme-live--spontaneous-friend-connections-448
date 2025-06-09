import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Briefcase, Home, Users } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Mode } from '@/types';

interface ModeSelectorProps {
  selectedModes: Mode[];
  onToggleMode: (mode: Mode) => void;
  onSelectAll: () => void;
}

interface ModeOption {
  id: Mode;
  label: string;
  icon: React.ReactNode;
}

export const ModeSelector = ({ 
  selectedModes,
  onToggleMode,
  onSelectAll
}: ModeSelectorProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  const handleToggle = (mode: Mode) => {
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
    }
  ];
  
  const modeOptions = getModeOptions(colors);
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Select Modes
        </Text>
        <TouchableOpacity 
          style={styles.selectAllButton} 
          onPress={onSelectAll}
        >
          <Text style={[styles.selectAllText, { color: colors.primary }]}>
            Select All
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.pillsContainer}>
        {modeOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectAllButton: {
    paddingVertical: 4,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pillsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  pill: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
  },
});