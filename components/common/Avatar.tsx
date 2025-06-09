import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

interface AvatarProps {
  name: string;
  avatar?: string | null;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
}

export const Avatar = ({ 
  name, 
  avatar, 
  size = 50, 
  borderWidth = 0,
  borderColor
}: AvatarProps) => {
  const { colors = darkTheme } = useThemeStore();
  
  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name) return '?';
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };
  
  // Generate a consistent color based on the name
  const getBackgroundColor = (name: string) => {
    if (!name) return colors.primary;
    
    const colorOptions = [
      '#4ADE80', // Green
      '#F59E0B', // Amber
      '#3B82F6', // Blue
      '#EC4899', // Pink
      '#8B5CF6', // Purple
      '#EF4444', // Red
      '#06B6D4', // Cyan
      '#F97316', // Orange
    ];
    
    // Simple hash function to get a consistent index
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colorOptions.length;
    return colorOptions[index];
  };
  
  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);
  
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth,
    borderColor: borderColor || colors.background,
  };
  
  const textStyle = {
    fontSize: size * 0.4,
  };
  
  if (avatar) {
    return (
      <Image
        source={{ uri: avatar }}
        style={[styles.avatar, containerStyle]}
        contentFit="cover"
        transition={200}
      />
    );
  }
  
  return (
    <View style={[styles.initialsContainer, containerStyle, { backgroundColor }]}>
      <Text style={[styles.initialsText, textStyle]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#E2E8F0',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});