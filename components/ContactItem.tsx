import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Contact } from '@/types';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';
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
    
    // Simple formatting without date-fns
    const now = new Date();
    const lastOnline = new Date(contact.lastOnline);
    const diffMs = now.getTime() - lastOnline.getTime();
    
    // Convert to minutes, hours, days
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `Last online ${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `Last online ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `Last online ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
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