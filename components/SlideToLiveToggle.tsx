import React, { useRef, useState } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  PanResponder,
  Platform,
  TouchableOpacity
} from 'react-native';
import { Phone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/store/useThemeStore';
import { darkTheme } from '@/constants/colors';

// Update thumb styles to use light grey
const styles = StyleSheet.create({
  // Previous styles remain
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#F3F4F6', // Light grey color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Rest of the styles remain the same
});