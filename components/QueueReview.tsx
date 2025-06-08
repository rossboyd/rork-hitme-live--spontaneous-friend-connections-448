import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { HitRequest, Contact } from '@/types';
import { X, Check } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';

// ... rest of the component code stays the same ...

const styles = StyleSheet.create({
  // ... other styles stay the same ...
  goLiveButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#00FF00', // Updated to use consistent green
  },
  // ... other styles stay the same ...
});