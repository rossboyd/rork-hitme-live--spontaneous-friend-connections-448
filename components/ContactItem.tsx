import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Contact } from '@/types';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, Clock } from 'lucide-react-native';

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
  onToggleHitList,
}: ContactItemProps) => {
  const { colors = darkTheme } = useThemeStore();

  const handlePress = () => {
    onPress(contact);
  };

  const handleToggleHitList = (e: any) => {
    e.stopPropagation();
    if (onToggleHitList) {
      onToggleHitList(contact);
    }
  };

  // Format last online time
  const getLastOnlineText = () => {
    if (!contact.lastOnline) return 'Never online';
    return `Last online ${formatDistanceToNow(contact.lastOnline, { addSuffix: true })}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: contact.avatar }}
        style={styles.avatar}
        contentFit="cover"
      />
      
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text.primary }]}>
          {contact.name}
        </Text>
        
        {showLastOnline && (
          <View style={styles.lastOnlineContainer}>
            <Clock size={12} color={colors.text.light} style={styles.clockIcon} />
            <Text style={[styles.lastOnline, { color: colors.text.light }]}>
              {getLastOnlineText()}
            </Text>
          </View>
        )}
      </View>
      
      {onToggleHitList && (
        <TouchableOpacity
          style={[
            styles.hitListButton,
            { 
              backgroundColor: isInHitList ? colors.primary : 'transparent',
              borderColor: isInHitList ? colors.primary : colors.border
            }
          ]}
          onPress={handleToggleHitList}
        >
          <Text 
            style={[
              styles.hitListButtonText, 
              { color: isInHitList ? '#000' : colors.text.secondary }
            ]}
          >
            {isInHitList ? 'In HitList' : 'Add'}
          </Text>
        </TouchableOpacity>
      )}
      
      <ChevronRight size={20} color={colors.text.light} />
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
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  lastOnlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 4,
  },
  lastOnline: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  hitListButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 12,
  },
  hitListButtonText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans-Medium',
  },
});