import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Filter, Briefcase, Home, Users, Check, X } from 'lucide-react-native';
import { Contact, Mode } from '@/types';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface ModeAssociationsProps {
  contact: Contact;
  onToggleMode: (mode: Mode) => void;
}

interface ModeOption {
  id: Mode;
  label: string;
  icon: React.ReactNode;
  description: (name: string) => string;
}

export const ModeAssociations = ({ contact, onToggleMode }: ModeAssociationsProps) => {
  const { colors = darkTheme } = useThemeStore();
  const contactModes = contact.modes || [];
  
  const modeOptions: ModeOption[] = [
    {
      id: 'work',
      label: 'Work',
      icon: <Briefcase size={24} color={colors.primary} />,
      description: (name) => `Show ${name} when you're in Work mode`
    },
    {
      id: 'social',
      label: 'Social',
      icon: <Users size={24} color={colors.primary} />,
      description: (name) => `Show ${name} when you're in Social mode`
    },
    {
      id: 'family',
      label: 'Family',
      icon: <Home size={24} color={colors.primary} />,
      description: (name) => `Show ${name} when you're in Family mode`
    }
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Filter size={24} color={colors.text.primary} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Mode Associations</Text>
      </View>
      
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        Choose which modes you want to associate with {contact.name}.
        They will only appear in your feed when you're in these modes.
      </Text>
      
      <View style={styles.modesList}>
        {modeOptions.map((mode) => {
          const isSelected = contactModes.includes(mode.id);
          
          return (
            <View key={mode.id} style={[
              styles.modeItem,
              { backgroundColor: colors.background }
            ]}>
              <View style={styles.modeHeader}>
                <View style={[styles.modeIconContainer, { backgroundColor: colors.card }]}>
                  {mode.icon}
                </View>
                <Text style={[styles.modeLabel, { color: colors.text.primary }]}>{mode.label}</Text>
              </View>
              
              <Text style={[styles.modeDescription, { color: colors.text.secondary }]}>
                {mode.description(contact.name)}
              </Text>
              
              <TouchableOpacity 
                style={[
                  styles.toggleButton,
                  { backgroundColor: isSelected ? colors.primary : colors.border }
                ]}
                onPress={() => onToggleMode(mode.id)}
              >
                {isSelected ? (
                  <Check size={24} color="#000" />
                ) : (
                  <X size={24} color={colors.text.light} />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  modesList: {
    gap: 16,
  },
  modeItem: {
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modeLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  modeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  toggleButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});