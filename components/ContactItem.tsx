import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Contact, Mode } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { Avatar } from '@/components/common/Avatar';
import { Briefcase, Home, Heart, Crown, Meh, GripVertical } from 'lucide-react-native';

interface ContactItemProps {
  contact: Contact;
  onPress: (contact: Contact) => void;
  showLastOnline?: boolean;
  isInHitList?: boolean;
  onToggleHitList?: (contact: Contact) => void;
  showModes?: boolean;
  showGrabHandle?: boolean;
}

export const ContactItem = ({
  contact,
  onPress,
  showLastOnline = false,
  isInHitList = false,
  onToggleHitList,
  showModes = false,
  showGrabHandle = false
}: ContactItemProps) => {
  const { colors = darkTheme } = useThemeStore();
  const contactModes = contact.modes || [];

  const renderModeIcon = (mode: Mode) => {
    switch (mode) {
      case 'FAM':
        return <Home size={14} color={colors.primary} />;
      case 'VIP':
        return <Crown size={14} color={colors.primary} />;
      case 'BFF':
        return <Heart size={14} color={colors.primary} />;
      case 'WRK':
        return <Briefcase size={14} color={colors.primary} />;
      case 'MEH':
        return <Meh size={14} color={colors.primary} />;
      default:
        return null;
    }
  };

  const getModeLabel = (mode: Mode) => {
    switch (mode) {
      case 'FAM':
        return 'Family';
      case 'VIP':
        return 'VIP';
      case 'BFF':
        return 'BFF';
      case 'WRK':
        return 'Work';
      case 'MEH':
        return 'Meh';
      default:
        return mode;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => onPress(contact)}
    >
      {showGrabHandle && (
        <View style={styles.dragHandle}>
          <GripVertical size={20} color={colors.text.light} />
        </View>
      )}
      
      <Avatar
        name={contact.name}
        avatar={contact.avatar}
        size={56}
      />
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text.primary }]}>{contact.name}</Text>
        <Text style={[styles.phone, { color: colors.text.secondary }]}>{contact.phone}</Text>
        
        {showLastOnline && contact.lastOnline && (
          <Text style={[styles.lastOnline, { color: colors.text.light }]}>
            Last online {formatDistanceToNow(contact.lastOnline)}
          </Text>
        )}
        
        {showModes && contactModes.length > 0 && (
          <View style={styles.modesContainer}>
            {contactModes.map((mode) => (
              <View 
                key={mode} 
                style={[styles.modeTag, { backgroundColor: colors.background }]}
              >
                {renderModeIcon(mode)}
                <Text style={[styles.modeText, { color: colors.text.secondary }]}>
                  {getModeLabel(mode)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      {onToggleHitList && (
        <TouchableOpacity
          style={[
            styles.hitListButton,
            isInHitList ? 
              { backgroundColor: colors.primary, borderColor: colors.primary } : 
              { borderColor: colors.primary }
          ]}
          onPress={() => onToggleHitList(contact)}
        >
          <Text style={[
            styles.hitListButtonText,
            { color: isInHitList ? '#000' : colors.primary }
          ]}>
            {isInHitList ? 'In HitList' : 'Add'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dragHandle: {
    marginRight: 12,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    marginBottom: 4,
  },
  lastOnline: {
    fontSize: 12,
  },
  modesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 6,
  },
  modeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  modeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  hitListButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  hitListButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});