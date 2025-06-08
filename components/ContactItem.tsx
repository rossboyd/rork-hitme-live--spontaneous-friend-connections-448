import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Contact } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { useThemeStore } from '@/store/useThemeStore';

interface ContactItemProps {
  contact: Contact;
  onPress: (contact: Contact) => void;
  showLastOnline?: boolean;
  isInHitList?: boolean;
  onToggleHitList?: (contact: Contact) => void;
}

export const ContactItem = ({
  contact,
  onPress,
  showLastOnline = false,
  isInHitList = false,
  onToggleHitList
}: ContactItemProps) => {
  const { colors } = useThemeStore();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => onPress(contact)}
    >
      <Image
        source={{ uri: contact.avatar }}
        style={styles.avatar}
        contentFit="cover"
      />
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text.primary }]}>{contact.name}</Text>
        <Text style={[styles.phone, { color: colors.text.secondary }]}>{contact.phone}</Text>
        
        {showLastOnline && contact.lastOnline && (
          <Text style={[styles.lastOnline, { color: colors.text.light }]}>
            Last online {formatDistanceToNow(contact.lastOnline)}
          </Text>
        )}
      </View>
      
      {onToggleHitList && (
        <TouchableOpacity
          style={[
            styles.hitListButton,
            isInHitList ? styles.inHitListButton : styles.notInHitListButton
          ]}
          onPress={() => onToggleHitList(contact)}
        >
          <Text style={[
            styles.hitListButtonText,
            { color: isInHitList ? '#fff' : '#00FF00' }
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  content: {
    flex: 1,
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
  hitListButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  inHitListButton: {
    backgroundColor: '#00FF00',
    borderColor: '#00FF00',
  },
  notInHitListButton: {
    backgroundColor: 'transparent',
    borderColor: '#00FF00',
  },
  hitListButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});