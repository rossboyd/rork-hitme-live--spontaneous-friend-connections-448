import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';

// ... rest of the component code stays the same ...

const styles = StyleSheet.create({
  // ... other styles stay the same ...
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00FF00',
    marginBottom: 40,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#00FF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#00FF0033',
  },
  // ... other styles stay the same ...
});