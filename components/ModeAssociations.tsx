import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Filter, Briefcase, Home, Heart, Crown, Meh, Check, X } from 'lucide-react-native';
import { Contact, Mode } from '@/types';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface ModeAssociationsProps {
  contact: Contact;
  onToggleMode: (mode: Mode) => void;
}

interface TraitOption {
  id: Mode;
  label: string;
  icon: React.ReactNode;
  description: (name: string) => string;
}

export const ModeAssociations = ({ contact, onToggleMode }: ModeAssociationsProps) => {
  const { colors = darkTheme } = useThemeStore();
  const contactModes = contact.modes || [];
  
  const traitOptions: TraitOption[] = [
    {
      id: 'FAM',
      label: 'Family',
      icon: <Home size={24} color={colors.primary} />,
      description: (name) => `Show ${name} when you are in Family mode`
    },
    {
      id: 'VIP',
      label: 'VIP',
      icon: <Crown size={24} color={colors.primary} />,
      description: (name) => `Show ${name} when you are in VIP mode`
    },
    {
      id: 'BFF',
      label: 'BFF',
      icon: <Heart size={24} color={colors.primary} />,
      description: (name) => `Show ${name} when you are in BFF mode`
    },
    {
      id: 'WRK',
      label: 'Work',
      icon: <Briefcase size={24} color={colors.primary} />,
      description: (name) => `Show ${name} when you are in Work mode`
    },
    {
      id: 'MEH',
      label: 'Meh',
      icon: <Meh size={24} color={colors.primary} />,
      description: (name) => `Show ${name} when you are in Meh mode`
    }
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Filter size={24} color={colors.text.primary} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Contact Traits</Text>
      </View>
      
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        Choose which traits to associate with {contact.name}.
        They will only appear in your feed when you are in these modes.
      </Text>
      
      <View style={styles.traitsList}>
        {traitOptions.map((trait) => {
          const isSelected = contactModes.includes(trait.id);
          
          return (
            <TouchableOpacity 
              key={trait.id} 
              style={[
                styles.traitItem,
                { backgroundColor: colors.background },
                isSelected && { borderColor: colors.primary, borderWidth: 2 }
              ]}
              onPress={() => onToggleMode(trait.id)}
            >
              <View style={styles.traitContent}>
                <View style={styles.traitHeader}>
                  <View style={[styles.traitIconContainer, { backgroundColor: colors.card }]}>
                    {trait.icon}
                  </View>
                  <View style={styles.traitInfo}>
                    <Text style={[styles.traitLabel, { color: colors.text.primary }]}>{trait.label}</Text>
                    <Text style={[styles.traitDescription, { color: colors.text.secondary }]}>
                      {trait.description(contact.name)}
                    </Text>
                  </View>
                </View>
                
                <View style={[
                  styles.toggleButton,
                  { backgroundColor: isSelected ? colors.primary : colors.border }
                ]}>
                  {isSelected ? (
                    <Check size={20} color="#000" />
                  ) : (
                    <X size={20} color={colors.text.light} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
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
  traitsList: {
    gap: 12,
  },
  traitItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  traitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  traitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  traitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  traitInfo: {
    flex: 1,
  },
  traitLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  traitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});