import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Contact } from '@/types';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { useThemeStore } from '@/store/useThemeStore';

// ... rest of the component code stays the same ...

const styles = StyleSheet.create({
  // ... other styles stay the same ...
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
  // ... other styles stay the same ...
});